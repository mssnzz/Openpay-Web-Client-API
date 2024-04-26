// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async createWithVariations(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const { categoryIds, storeIds, variations, ...productData } =
      createProductDto;

    // Create product instance and save it to get an ID
    let product = this.productRepository.create(productData);
    product = await this.productRepository.save(product);

    // Fetch categories and stores
    const categories = await this.categoryRepository.findByIds(categoryIds);
    const stores = await this.storeRepository.findByIds(storeIds);
    if (!categories.length || !stores.length) {
      throw new Error('Stores or categories not found.');
    }

    // Assign categories and stores to product and save again
    product.categories = categories;
    product.stores = stores;
    product = await this.productRepository.save(product);

    // Handle variations and their prices
    for (const variationDto of variations) {
      let variation = this.variationRepository.create({
        name: variationDto.name,
        stock: variationDto.stock,
        product: product,
      });
      variation = await this.variationRepository.save(variation);

      const prices = variationDto.prices.map((priceDto) => {
        return this.priceRepository.create({
          amount: priceDto.amount,
          conditions: priceDto.conditions,
          variation: variation,
        });
      });

      for (const price of prices) {
        await this.priceRepository.save(price);
      }
    }

    // Optionally, re-fetch the product with all relations
    return this.productRepository.findOne({
      where: { id: product.id },
      relations: ['categories', 'stores', 'variations', 'variations.prices'],
    });
  }
  // product.service.ts

  async deleteProducts(productIds: string[]): Promise<void> {
    // Encuentra todos los productos que coinciden con los IDs proporcionados
    const products = await this.productRepository.find({
      where: {
        id: In(productIds), // Usando el operador In para buscar todos los productos con los IDs en `productIds`
      },
      relations: ['variations', 'variations.prices'], // Incluyendo las relaciones
    });

    // Recorre cada producto para eliminar primero los precios y luego las variaciones
    // Eliminar variaciones asociadas
    // Assuming you want to delete prices related to variations when deleting a product
    for (const product of products) {
      // Delete prices via the variation relation
      for (const variation of product.variations) {
        await this.priceRepository.delete({ variation });
      }
      // Delete variations
      await this.variationRepository.delete({ product });
      // Delete product
      await this.productRepository.remove(product);
    }
  }
}
