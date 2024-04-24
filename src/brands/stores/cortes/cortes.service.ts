import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Corte, CorteEstado } from './cortes.entity';
import { CreateCorteDto } from './cortes.dto';
import { POS } from '../pos/pos.entity';
import { format, toZonedTime } from 'date-fns-tz';
import { Connection } from 'typeorm'; // Importar Connection para manejar transacciones

@Injectable()
export class CortesService {
  constructor(
    @InjectRepository(Corte)
    private cortesRepository: Repository<Corte>,
    @InjectRepository(POS)
    private posRepository: Repository<POS>,
    private connection: Connection, // Inyectar Connection para transacciones
  ) {}

  async addCorte(createCorteDto: CreateCorteDto): Promise<Corte> {
    return await this.connection.transaction(async (manager) => {
      const pos = await manager.findOne(POS, {
        where: { id: createCorteDto.posId },
      });
      if (!pos) {
        throw new Error('POS not found');
      }
      const estadoCorte =
        CorteEstado[createCorteDto.estado as keyof typeof CorteEstado];

      const newCorte = manager.create(Corte, {
        ...createCorteDto,
        pos: pos,
        estado: estadoCorte, // Asegurar que estado es del enum CorteEstado
      });

      // Cambiar el estado de POS según el estado de Corte
      pos.status =
        createCorteDto.estado === CorteEstado.CERRADO ? 'cerrado' : 'abierto';
      await manager.save(pos);

      return manager.save(newCorte);
    });
  }

  async getCorte(id: any, timezone: string): Promise<any> {
    const corte = await this.cortesRepository.findOne({ where: { id: id } });
    if (!corte) {
      throw new Error('Corte not found');
    }

    const zonedDate = toZonedTime(corte.fecha, timezone);
    return {
      ...corte,
      fecha: format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', {
        timeZone: timezone,
      }),
    };
  }
}
