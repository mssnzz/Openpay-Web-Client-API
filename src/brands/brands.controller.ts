// src/brands/brands.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './brands.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }
}
