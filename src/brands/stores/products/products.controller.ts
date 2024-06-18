// product.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './products.dto';
import { Product } from './products.entity';
import { CreateVariationDto } from './variations/variations.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createWithVariations(createProductDto);
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
  @Post('delete') // Using POST for deletion to include a body
  deleteProducts(@Body() body: { ids: string[] }) {
    return this.productService.deleteProducts(body.ids);
  }

  @Get('brand/:brandId')
  getProductsByBrand(@Param('brandId') brandId: string): Promise<Product[]> {
    return this.productService.findByBrandId(brandId);
  }
}
