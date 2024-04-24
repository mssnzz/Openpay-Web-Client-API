// category.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './categories.dto';
import Store from '../../stores.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>, // Inyecta el repositorio de Store
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const store = await this.storeRepository.findOneOrFail({
      where: { id: createCategoryDto.storeId },
    });
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      store: store,
    });
    return this.categoryRepository.save(category);
  }

  async findCategoriesByStoreId(storeId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { store: { id: storeId } },
      relations: ['store'], // Agrega 'products' si también quieres los productos de la categoría
    });
  }
}
