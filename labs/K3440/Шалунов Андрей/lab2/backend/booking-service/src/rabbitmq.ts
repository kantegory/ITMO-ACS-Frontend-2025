import amqplib, { Channel, Connection } from 'amqplib'

let connection: Connection | null = null
let channel: Channel | null = null

async function getChannel(): Promise<Channel> {
    if (channel) return channel

    const url = process.env.AMQP_URL || 'amqp://rabbitmq:5672'
    connection = await amqplib.connect(url)
    channel = await connection.createChannel()

    await channel.assertExchange('booking.events', 'topic', { durable: true })

    return channel
}

export async function publishBookingEvent(routingKey: string, data: any): Promise<void> {
    const ch = await getChannel()

    const payload = Buffer.from(
        JSON.stringify({
            event: routingKey,
            data,
            date: new Date().toISOString(),
        })
    )

    ch.publish('booking.events', routingKey, payload, { persistent: true })
}