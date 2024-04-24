// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './products.dto';
import { Category } from './categories/categories.entity';
import Store from '../stores.entity';
import { Price } from './variations/prices/price.entity';
import { Variation } from './variations/variations.entity';
import { CreateVariationDto } from './variations/variations.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Variation)
    private readonly variationRepository: Repository<Variation>,
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryIds, storeIds, ...productData } = createProductDto;

    // Crear el producto sin las relaciones
    let product = this.productRepository.create(productData);

    // Guardar el producto para generar el ID
    product = await this.productRepository.save(product);

    // Encontrar las categorías y tiendas existentes
    const categories = await this.categoryRepository.findByIds(categoryIds);
    const stores = await this.storeRepository.findByIds(storeIds);

    if (!stores.length || !categories.length) {
      throw new Error('Stores or categories not found.');
    }

    // Asignar las relaciones
    product.categories = categories;
    product.stores = stores;

    // Guardar nuevamente con las relaciones establecidas
    return this.productRepository.save(product);
  }

  async findByStoreId(storeId: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.stores', 'store')
      .leftJoinAndSelect('store.brand', 'brand') // Añadir la marca asociada con la tienda
      .innerJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.variations', 'variation') // Añadir las variaciones del producto
      .leftJoinAndSelect('variation.prices', 'price') // Añadir los precios de cada variación
      .where('store.id = :storeId', { storeId })
      .getMany();
  }

  // Crear variaciones del producto y precios
  async addVariations(
    productId: string,
    variationDtos: CreateVariationDto[],
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new Error('Product not found');
    }

    for (const variationDto of variationDtos) {
      const variation = new Variation();
      variation.name = variationDto.name;
      variation.product = product;

      const savedVariation = await this.variationRepository.save(variation);

      for (const priceDto of variationDto.prices) {
        const price = new Price();
        price.amount = priceDto.amount;
        price.conditions = priceDto.conditions;
        price.variation = savedVariation;

        await this.priceRepository.save(price);
      }
    }

    // Recuperar el producto con sus variaciones y precios utilizando createQueryBuilder
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variations', 'variation')
      .leftJoinAndSelect('variation.prices', 'price')
      .where('product.id = :productId', { productId })
      .getOne();
  }

  // Add other methods as needed
}
