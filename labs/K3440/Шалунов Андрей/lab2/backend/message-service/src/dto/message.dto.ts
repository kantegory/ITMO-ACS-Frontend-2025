import {
    IsInt,
    IsString,
    IsOptional,
    IsBoolean,
    IsDate,
} from 'class-validator';

export class CreateMessageDto {
    @IsInt()
    sender_id!: number;

    @IsInt()
    recipient_id!: number;

    @IsInt()
    property_id!: number;

    @IsString()
    text!: string;
}

export class UpdateMessageDto {
    @IsOptional()
    @IsString()
    text?: string;
}

export class MessageResponseDto {
    @IsInt()
    message_id!: number;

    @IsInt()
    chat_id!: number;

    @IsInt()
    sender_id!: number;

    @IsInt()
    recipient_id!: number;

    @IsString()
    text!: string;

    @IsBoolean()
    is_read!: boolean;

    @IsDate()
    sent_at!: Date;
}

export class ChatResponseDto {
    @IsInt()
    chat_id!: number;

    @IsInt()
    property_id!: number;

    @IsInt()
    user1_id!: number;

    @IsInt()
    user2_id!: number;

    @IsDate()
    created_at!: Date;

    @IsDate()
    updated_at!: Date;

    @IsOptional()
    lastMessage?: MessageResponseDto;
}