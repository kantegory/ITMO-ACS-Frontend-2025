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

    const q = await channel.assertQueue('user.events.property', { durable: true })
    await channel.bindQueue(q.queue, 'user.events', '')

    await channel.consume(q.queue, async (msg: ConsumeMessage | null) => {
        if (!msg) return

        try {
            const payload = JSON.parse(msg.content.toString())
            const data = payload?.data

            const userId = Number(data?.user_id)
            if (!userId) {
                channel!.ack(msg)
                return
            }

            const repo = AppDataSource.getRepository(User)

            const toSave: Partial<User> = {
                user_id: userId,
                name: data?.name,
                email: data?.email,
                phone: data?.phone ?? null,
            }

            const existing = await repo.findOneBy({ user_id: userId })

            if (!existing) {
                await repo.save(repo.create(toSave as User))
            } else {
                await repo.update({ user_id: userId }, toSave)
            }

            channel!.ack(msg)
        } catch (e) {
            channel!.nack(msg, false, false)
        }
    })
}