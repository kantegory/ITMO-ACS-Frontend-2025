import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Column,
  Unique,
} from "typeorm";
import { User } from "./user.entity";

@Entity("subscriptions")
@Unique(["follower_id", "following_id"])
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  follower_id: number;

  @Column()
  following_id: number;

  @ManyToOne(() => User, (user) => user.following, { onDelete: "CASCADE" })
  @JoinColumn({ name: "follower_id" })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "following_id" })
  followed: User;

  @CreateDateColumn()
  created_at: Date;
}
