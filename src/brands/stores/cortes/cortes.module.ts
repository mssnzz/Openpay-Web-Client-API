import { Module } from '@nestjs/common';
import { CortesController } from './cortes.controller';
import { CortesService } from './cortes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corte } from './cortes.entity';
import { POS } from '../pos/pos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Corte]), // Registra solo la entidad Corte
    TypeOrmModule.forFeature([POS]),
  ],
  controllers: [CortesController],
  providers: [CortesService],
  exports: [CortesService], // Exporta el servicio CortesService si es necesario usarlo en otros módulos
})
export class CortesModule {}
