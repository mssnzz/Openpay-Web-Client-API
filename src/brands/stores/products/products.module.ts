// product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './products.controller';
import { Product } from './products.entity';
import { ProductService } from './products.service';
import Store from '../stores.entity';
import { Category } from './categories/categories.entity';
import { Variation } from './variations/variations.entity'; // Importa la entidad de Variation
import { Price } from './variations/prices/price.entity'; // Importa la entidad de Price

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, // Entidad de productos
      Store, // Entidad de tiendas
      Category, // Entidad de categorías
      Variation, // Entidad de variaciones de productos
      Price, // Entidad de precios de las variaciones
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
