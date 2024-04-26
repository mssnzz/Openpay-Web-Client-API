// src/stores/stores.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Store from './stores.entity';
import { CreateStoreDto } from './stores.dto';
import Brands from '../brands.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Brands)
    private readonly brandRepository: Repository<Brands>, // Inyecta el repositorio de Brand
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    // Primero, busca la marca por UUID
    const brand = await this.brandRepository.findOneBy({
      id: createStoreDto.brandUuid,
    });
    if (!brand) {
      throw new Error('Brand not found');
    }

    // Crea la tienda y asigna la marca
    const store = this.storeRepository.create({
      ...createStoreDto,
      brand, // Asume que tienes una columna o relación en tu entidad Store para esto
    });

    return this.storeRepository.save(store);
  }
  async findStoresByUserId(userId: string): Promise<Store[]> {
    return this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }
}
