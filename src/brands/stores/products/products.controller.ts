// product.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './products.dto';
import { Product } from './products.entity';
import { CreateVariationDto } from './variations/variations.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get('store/:storeId')
  getProductsByStore(@Param('storeId') storeId: string): Promise<Product[]> {
    return this.productService.findByStoreId(storeId);
  }

  @Post(':productId/variations')
  addProductVariations(
    @Param('productId') productId: string,
    @Body() createVariationDtos: CreateVariationDto[],
  ) {
    return this.productService.addVariations(productId, createVariationDtos);
  }

  // Add other endpoints as needed
}
