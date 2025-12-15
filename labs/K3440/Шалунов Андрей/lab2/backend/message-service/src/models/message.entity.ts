import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    message_id!: number;

    @ManyToOne(() => User, u => u.sentMessages)
    @JoinColumn({ name: 'sender_id' })
    sender!: User;

    @ManyToOne(() => User, u => u.receivedMessages)
    @JoinColumn({ name: 'recipient_id' })
    recipient!: User;

    @ManyToOne(() => Chat, c => c.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chat_id' })
    chat!: Chat;

    @Column('text')
    text!: string;

    @Column({ default: false })
    is_read!: boolean;

    @CreateDateColumn()
    sent_at!: Date;
}