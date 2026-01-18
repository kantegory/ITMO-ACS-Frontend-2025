import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib'
import { AppDataSource } from './config/data-source'
import { Property } from './models/property.entity'
import { publishBookingEvent } from './rabbitmq'

let connection: Connection | null = null
let channel: Channel | null = null

const ALLOWED_STATUSES = new Set(['available'])

export async function startBookingEventsConsumer(): Promise<void> {
    const url = process.env.AMQP_URL || 'amqp://rabbitmq:5672'
    connection = await amqplib.connect(url)
    channel = await connection.createChannel()

    await channel.assertExchange('booking.events', 'topic', { durable: true })

    const q = await channel.assertQueue('booking.events.property', { durable: true })
    await channel.bindQueue(q.queue, 'booking.events', 'booking.created')

    await channel.consume(q.queue, async (msg: ConsumeMessage | null) => {
        if (!msg) return

        try {
            const payload = JSON.parse(msg.content.toString())
            const data = payload?.data

            const bookingId = Number(data?.booking_id)
            const propertyId = Number(data?.property_id)
            const renterId = Number(data?.renter_id)

            if (!bookingId || !propertyId || !renterId) {
                channel!.ack(msg)
                return
            }

            const repo = AppDataSource.getRepository(Property)

            const property = await repo.findOne({
                where: { property_id: propertyId },
                relations: ['owner'],
            })

            if (!property) {
                await publishBookingEvent('booking.rejected', {
                    booking_id: bookingId,
                    property_id: propertyId,
                    renter_id: renterId,
                    reason: 'Property not found',
                })
                channel!.ack(msg)
                return
            }

            const currentStatus = String(property.status ?? '').toLowerCase()

            if (!ALLOWED_STATUSES.has(currentStatus)) {
                await publishBookingEvent('booking.rejected', {
                    booking_id: bookingId,
                    property_id: propertyId,
                    renter_id: renterId,
                    reason: `Property not available: ${property.status}`,
                })
                channel!.ack(msg)
                return
            }

            property.status = 'reserved'
            await repo.save(property)

            await publishBookingEvent('property.reserved', {
                booking_id: bookingId,
                property_id: propertyId,
                renter_id: renterId,
            })

            channel!.ack(msg)
        } catch (err) {
            console.error('booking.events.property consumer error:', err)
            channel!.nack(msg, false, false)
        }
    })
}