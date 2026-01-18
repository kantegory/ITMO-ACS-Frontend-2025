import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib'
import { AppDataSource } from './config/data-source'
import { Chat } from './models/chat.entity'
import { Message } from './models/message.entity'
import { User } from './models/user.entity'
import { fetchProperty } from './clients/property.client'

let connection: Connection | null = null
let channel: Channel | null = null

export async function startBookingEventsConsumer(): Promise<void> {
    const url = process.env.AMQP_URL || 'amqp://rabbitmq:5672'
    connection = await amqplib.connect(url)
    channel = await connection.createChannel()

    await channel.assertExchange('booking.events', 'topic', { durable: true })

    const q = await channel.assertQueue('booking.events.message', { durable: true })
    await channel.bindQueue(q.queue, 'booking.events', 'property.reserved')

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

            const property = await fetchProperty(propertyId)
            const ownerId = Number(property?.owner?.user_id)

            if (!ownerId) {
                channel!.ack(msg)
                return
            }

            const userRepo = AppDataSource.getRepository(User)
            const chatRepo = AppDataSource.getRepository(Chat)
            const messageRepo = AppDataSource.getRepository(Message)

            let owner = await userRepo.findOneBy({ user_id: ownerId })
            if (!owner) {
                owner = userRepo.create({
                    user_id: ownerId,
                    name: property.owner.name,
                    email: property.owner.email,
                    phone: property.owner.phone ?? null,
                })
                await userRepo.save(owner)
            }

            let renter = await userRepo.findOneBy({ user_id: renterId })
            if (!renter) {
                renter = userRepo.create({
                    user_id: renterId,
                    name: `user_${renterId}`,
                    email: `user_${renterId}@local`,
                    phone: null,
                })
                await userRepo.save(renter)
            }

            let chat = await chatRepo.findOne({
                where: [
                    { property_id: propertyId, user1: { user_id: ownerId }, user2: { user_id: renterId } },
                    { property_id: propertyId, user1: { user_id: renterId }, user2: { user_id: ownerId } },
                ],
                relations: ['user1', 'user2'],
            })

            if (!chat) {
                chat = chatRepo.create({
                    property_id: propertyId,
                    user1: owner,
                    user2: renter,
                })
                await chatRepo.save(chat)
            }

            const text = `Booking #${bookingId} confirmed: property #${propertyId} reserved.`
            const systemMessage = messageRepo.create({
                sender: owner,
                recipient: renter,
                chat,
                text,
                is_read: false,
            })

            await messageRepo.save(systemMessage)

            chat.updated_at = new Date()
            await chatRepo.save(chat)

            channel!.ack(msg)
        } catch (e) {
            channel!.nack(msg, false, false)
        }
    })
}