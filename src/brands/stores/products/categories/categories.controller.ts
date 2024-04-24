// category.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from './categories.dto';
import { CategoryService } from './categories.service';
import { Category } from './categories.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get(':storeId')
  findCategoriesByStore(
    @Param('storeId') storeId: string,
  ): Promise<Category[]> {
    return this.categoryService.findCategoriesByStoreId(storeId);
  }
}
