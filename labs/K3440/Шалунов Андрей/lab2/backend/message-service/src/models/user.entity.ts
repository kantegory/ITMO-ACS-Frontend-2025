import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { Chat } from './chat.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    phone?: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => Message, m => m.sender)
    sentMessages!: Message[];

    @OneToMany(() => Message, m => m.recipient)
    receivedMessages!: Message[];

    @OneToMany(() => Chat, c => c.user1)
    chatsAsUser1!: Chat[];

    @OneToMany(() => Chat, c => c.user2)
    chatsAsUser2!: Chat[];
}