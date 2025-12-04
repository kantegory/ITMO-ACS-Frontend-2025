import { AppDataSource } from '../config/data-source';
import { Message } from '../models/message.entity';
import { User } from '../models/user.entity';
import { Chat } from '../models/chat.entity';
import { CreateMessageDto, UpdateMessageDto } from '../dto/message.dto';
import { fetchUser } from '../clients/user.client';
import { NotFoundError } from 'routing-controllers';

const messageRepo = AppDataSource.getRepository(Message);
const userRepo = AppDataSource.getRepository(User);
const chatRepo = AppDataSource.getRepository(Chat);

export class MessageService {
    static async createMessage(dto: CreateMessageDto, authHeader?: string) {
        const remoteSender = await fetchUser(dto.sender_id, authHeader);
        let sender = await userRepo.findOneBy({ user_id: dto.sender_id });
        if (!sender) {
            sender = userRepo.create({
                user_id: remoteSender.user_id,
                name: remoteSender.name,
                email: remoteSender.email,
                phone: remoteSender.phone ?? undefined,
            });
            await userRepo.save(sender);
        }

        const remoteRecipient = await fetchUser(dto.recipient_id, authHeader);
        let recipient = await userRepo.findOneBy({ user_id: dto.recipient_id });
        if (!recipient) {
            recipient = userRepo.create({
                user_id: remoteRecipient.user_id,
                name: remoteRecipient.name,
                email: remoteRecipient.email,
                phone: remoteRecipient.phone ?? undefined,
            });
            await userRepo.save(recipient);
        }

        let chat = await chatRepo.findOne({
            where: [
                {
                    property_id: dto.property_id,
                    user1: { user_id: sender.user_id },
                    user2: { user_id: recipient.user_id },
                },
                {
                    property_id: dto.property_id,
                    user1: { user_id: recipient.user_id },
                    user2: { user_id: sender.user_id },
                },
            ],
            relations: ['user1', 'user2'],
        });

        if (!chat) {
            chat = chatRepo.create({
                property_id: dto.property_id,
                user1: sender,
                user2: recipient,
            });
            await chatRepo.save(chat);
        }

        const message = messageRepo.create({
            sender,
            recipient,
            chat,
            text: dto.text,
        });

        return messageRepo.save(message);
    }

    static getAllMessages() {
        return messageRepo.find({
            relations: ['sender', 'recipient', 'chat'],
        });
    }

    static async getMessageById(id: number) {
        const m = await messageRepo.findOne({
            where: { message_id: id },
            relations: ['sender', 'recipient', 'chat'],
        });
        if (!m) throw new NotFoundError('Message not found');
        return m;
    }

    static async updateMessage(id: number, dto: UpdateMessageDto) {
        await messageRepo.update({ message_id: id }, dto);
        return this.getMessageById(id);
    }

    static async deleteMessage(id: number) {
        const r = await messageRepo.delete({ message_id: id });
        if (r.affected === 0) throw new NotFoundError('Message not found');
    }

    static async getChatsForUser(userId: number) {
        const chats = await chatRepo.find({
            where: [
                { user1: { user_id: userId } },
                { user2: { user_id: userId } },
            ],
            relations: ['user1', 'user2'],
            order: { updated_at: 'DESC' },
        });

        const result = await Promise.all(
            chats.map(async (chat) => {
                const lastMessage = await messageRepo.findOne({
                    where: { chat: { chat_id: chat.chat_id } },
                    relations: ['sender', 'recipient'],
                    order: { sent_at: 'DESC' },
                });

                return {
                    ...chat,
                    lastMessage,
                };
            })
        );

        return result;
    }

    static async getMessagesByChat(chatId: number) {
        return messageRepo.find({
            where: { chat: { chat_id: chatId } },
            relations: ['sender', 'recipient', 'chat'],
            order: { sent_at: 'ASC' },
        });
    }
}