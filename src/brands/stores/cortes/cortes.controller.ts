// cortes.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import { CortesService } from './cortes.service';
import { CreateCorteDto } from './cortes.dto';
import { Corte } from './cortes.entity';

// cortes.controller.ts
@Controller('cortes')
export class CortesController {
  constructor(private cortesService: CortesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addCorte(@Body() createCorteDto: CreateCorteDto) {
    console.log(createCorteDto); // Log the received DTO
    return this.cortesService.addCorte(createCorteDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCorte(
    @Param('id') id: any,
    @Query('timezone') timezone: string,
  ): Promise<Corte> {
    return this.cortesService.getCorte(id, timezone);
  }
}
