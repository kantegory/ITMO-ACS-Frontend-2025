import { IsEmail, IsNotEmpty, Length, IsOptional, IsPhoneNumber } from 'class-validator'

export class RegisterDto {
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @Length(6, 50)
    password!: string

    @IsNotEmpty()
    @Length(1, 100)
    name!: string

    @IsOptional()
    @IsPhoneNumber('RU')
    phone?: string
}

export class LoginDto {
    @IsEmail()
    email!: string

    @IsNotEmpty()
    password!: string
}