import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib'
import { AppDataSource } from './config/data-source'
import { User } from './models/user.entity'

let connection: Connection | null = null
let channel: Channel | null = null

export async function startUserEventsConsumer(): Promise<void> {
    const url = process.env.AMQP_URL || 'amqp://rabbitmq:5672'
    connection = await amqplib.connect(url)
    channel = await connection.createChannel()

    await channel.assertExchange('user.events', 'fanout', { durable: true })

    const q = await channel.assertQueue('user.events.message', { durable: true })
    await channel.bindQueue(q.queue, 'user.events', '')

    await channel.consume(q.queue, async (message: ConsumeMessage | null) => {
        if (!message) return

        try {
            const payload = JSON.parse(message.content.toString())
            const data = payload?.data

            if (!data?.user_id) {
                channel!.ack(message)
                return
            }

            const repo = AppDataSource.getRepository(User)

            const existing = await repo.findOneBy({ user_id: data.user_id })
            if (!existing) {
                const created = repo.create({
                    user_id: data.user_id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone ?? null
                })
                await repo.save(created)
            } else {
                await repo.update(
                    { user_id: data.user_id },
                    {
                        name: data.name,
                        email: data.email,
                        phone: data.phone ?? null
                    }
                )
            }

            channel!.ack(message)
        } catch {
            channel!.nack(message, false, false)
        }
    })
}