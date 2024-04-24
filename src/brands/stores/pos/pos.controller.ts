import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { PosService } from './pos.service';

@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post()
  create(@Body() body: any) {
    // Debes validar y extraer los parámetros necesarios del cuerpo de la solicitud.
    // Esto es solo un ejemplo. En una aplicación real, deberías validar los datos de entrada.
    return this.posService.create(body.name, body.storeId);
  }
  @Post('/pairing')
  async findByPairingCode(@Body() body: { pairingCode: string }) {
    try {
      const pos = await this.posService.findByPairingCodeAndChangeStatus(
        body.pairingCode,
        'new', // Estado inicial esperado
        'closed', // Estado final después de la operación
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
}
