// src/brands/brands.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brands } from './brands.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brands])],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
