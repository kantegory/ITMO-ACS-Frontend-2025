import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    chat_id!: number;

    @Column()
    property_id!: number;

    @ManyToOne(() => User, u => u.chatsAsUser1)
    @JoinColumn({ name: 'user1_id' })
    user1!: User;

    @ManyToOne(() => User, u => u.chatsAsUser2)
    @JoinColumn({ name: 'user2_id' })
    user2!: User;

    @OneToMany(() => Message, m => m.chat)
    messages!: Message[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}