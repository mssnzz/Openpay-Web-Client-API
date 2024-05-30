import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Get,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { PosService } from './pos.service';

@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post()
  create(@Body() body: any) {
    return this.posService.create(body.name, body.store);
  }

  @Post('/pairing')
  async findByPairingCode(@Body() body: { pairingCode: string }) {
    try {
      const pos = await this.posService.findByPairingCodeAndChangeStatus(
        body.pairingCode,
        'new',
        'closed',
      );
      return { message: 'Success', pos };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id/details')
  async getPosDetails(@Param('id') id: string) {
    try {
      const posDetails = await this.posService.findPosWithStoreAndBrand(id);
      return posDetails;
    } catch (error) {
      throw new NotFoundException('POS not found');
    }
  }

  @Get(':pairingCode')
  async getPosInfo(@Param('pairingCode') pairingCode: string) {
    try {
      const posInfo =
        await this.posService.getPosInfoByPairingCode(pairingCode);
      return posInfo;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/brand/:brandId')
  async getPosByBrandId(@Param('brandId') brandId: string) {
    try {
      const posList = await this.posService.findPosByBrandId(brandId);
      return posList;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    try {
      const updatedPos = await this.posService.update(id, updateData);
      return updatedPos;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.posService.delete(id);
      return { message: 'POS deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
