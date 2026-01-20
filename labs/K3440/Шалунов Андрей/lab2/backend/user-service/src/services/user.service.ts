import { AppDataSource } from '../config/data-source'
import { User } from '../models/user.entity'
import hashPassword from '../utils/hash-password'
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto'
import { NotFoundError, BadRequestError } from 'routing-controllers'
import { publishUserEvent } from '../rabbitmq'

const repo = AppDataSource.getRepository(User)

export class UserService {
    static async createUser(dto: CreateUserDto): Promise<User> {
        const exists = await repo.findOneBy({ email: dto.email })
        if (exists) {
            throw new BadRequestError('Email already in use')
        }

        const user = repo.create({
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            password: hashPassword(dto.password)
        })

        const saved = await repo.save(user)

        await publishUserEvent('user.created', {
            user_id: saved.user_id,
            name: saved.name,
            email: saved.email,
            phone: saved.phone ?? null
        })

        return saved
    }

    static getAllUsers(): Promise<User[]> {
        return repo.find()
    }

    static async getUserById(id: number): Promise<User> {
        const user = await repo.findOneBy({ user_id: id })
        if (!user) {
            throw new NotFoundError('User not found')
        }
        return user
    }

    static async getUserByEmail(email: string): Promise<User> {
        const user = await repo.findOneBy({ email })
        if (!user) {
            throw new NotFoundError('User not found')
        }
        return user
    }

    static async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
        if (dto.password) {
            dto.password = hashPassword(dto.password)
        }

        await repo.update({ user_id: id }, dto)
        const updated = await this.getUserById(id)

        await publishUserEvent('user.updated', {
            user_id: updated.user_id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone ?? null
        })

        return updated
    }

    static async deleteUser(id: number): Promise<void> {
        const result = await repo.delete({ user_id: id })
        if (result.affected === 0) {
            throw new NotFoundError('User not found')
        }
    }
}