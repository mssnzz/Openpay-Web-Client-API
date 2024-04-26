// src/stores/stores.controller.ts

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './stores.dto';
import Store from './stores.entity';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get('/user/:userId')
  findStoresByUser(@Param('userId') userId: string): Promise<Store[]> {
    return this.storesService.findStoresByUserId(userId);
  }
}
