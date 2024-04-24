// src/stores/stores.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './stores.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }
}
