import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { Category } from './categories.entity';
import Store from '../../stores.entity';
import Brands from 'src/brands/brands.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Store, Brands]), // Registra el modelo Category y Store para inyección
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService], // Opcional: exporta el servicio si se va a usar fuera de este módulo
})
export class CategoryModule {}
