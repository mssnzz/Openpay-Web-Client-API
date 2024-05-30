// src/brands/brands.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brands } from './brands.entity';
import { CreateBrandDto } from './brands.dto';
import Store from './stores/stores.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brands)
    private brandsRepository: Repository<Brands>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brands> {
    const brand = this.brandsRepository.create(createBrandDto);
    return this.brandsRepository.save(brand);
  }

  async findStoresByBrandId(brandId: string): Promise<Store[]> {
    const brand = await this.brandsRepository.findOne({
      where: { id: brandId },
      relations: ['stores'], // Make sure 'stores' is a valid relation in your Brands entity
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    return brand.stores;
  }
}
