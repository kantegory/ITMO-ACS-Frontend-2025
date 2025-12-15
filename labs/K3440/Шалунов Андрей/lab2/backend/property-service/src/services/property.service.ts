import { AppDataSource } from '../config/data-source';
import { Property } from '../models/property.entity';
import { User } from '../models/user.entity';
import { CreatePropertyDto, UpdatePropertyDto } from '../dto/property.dto';
import { fetchUser } from '../clients/user.client';
import { NotFoundError } from 'routing-controllers';

const propertyRepo = AppDataSource.getRepository(Property);
const userRepo = AppDataSource.getRepository(User);

type PropertyFilters = {
    type?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    ownerId?: number;
};

export class PropertyService {
    static async createProperty(
        dto: CreatePropertyDto,
        authHeader?: string
    ) {
        const remoteUser = await fetchUser(dto.owner_id, authHeader);

        let localUser = await userRepo.findOneBy({ user_id: dto.owner_id });
        if (!localUser) {
            localUser = userRepo.create({
                user_id: dto.owner_id,
                name: remoteUser.name,
                email: remoteUser.email,
                phone: remoteUser.phone ?? undefined
            });
            await userRepo.save(localUser);
        }

        const entity = propertyRepo.create({
            owner: localUser,
            type: dto.type,
            title: dto.title,
            description: dto.description,
            location: dto.location,
            price_per_day: dto.price_per_day,
            status: dto.status,
            features: dto.features ?? undefined,
            rental_terms: dto.rental_terms ?? undefined
        });
        return propertyRepo.save(entity);
    }

    static async getAllProperties(filters: PropertyFilters = {}) {
        const qb = propertyRepo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.owner', 'o');

        if (filters.type) {
            qb.andWhere('LOWER(p.type) = LOWER(:type)', { type: filters.type });
        }

        if (filters.minPrice !== undefined) {
            qb.andWhere('p.price_per_day >= :minPrice', {
                minPrice: filters.minPrice
            });
        }

        if (filters.maxPrice !== undefined) {
            qb.andWhere('p.price_per_day <= :maxPrice', {
                maxPrice: filters.maxPrice
            });
        }

        if (filters.city) {
            qb.andWhere('LOWER(p.location) LIKE :city', {
                city: `%${filters.city.toLowerCase()}%`
            });
        }

        if (filters.ownerId !== undefined) {
            qb.andWhere('o.user_id = :ownerId', {
                ownerId: filters.ownerId
            });
        }

        return qb.getMany();
    }

    static async getPropertyById(id: number) {
        const p = await propertyRepo.findOne({
            where: { property_id: id },
            relations: ['owner']
        });
        if (!p) throw new NotFoundError('Property not found');
        return p;
    }

    static async updateProperty(
        id: number,
        dto: UpdatePropertyDto,
        authHeader?: string
    ) {
        if (dto.owner_id) {
            await fetchUser(dto.owner_id, authHeader);
        }
        await propertyRepo.update({ property_id: id }, dto);
        return this.getPropertyById(id);
    }

    static async deleteProperty(id: number) {
        const res = await propertyRepo.delete({ property_id: id });
        if (res.affected === 0) throw new NotFoundError('Property not found');
    }
}