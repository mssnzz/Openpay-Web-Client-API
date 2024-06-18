import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosService } from './pos.service';
import { PosController } from './pos.controller';
import { POS } from './pos.entity';
import Store from '../stores.entity';
import { CortesModule } from '../cortes/cortes.module';
import Brands from 'src/brands/brands.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([POS, Store, Brands]), // Combina POS y Store en una sola llamada a forFeature
    CortesModule, // Importa CortesModule si necesitas utilizar servicios o controladores definidos en CortesModule
  ],
  providers: [PosService], // Provee el servicio PosService para ser utilizado en el módulo
  controllers: [PosController], // Registra PosController para manejar las rutas del módulo
})
export class PosModule {}
