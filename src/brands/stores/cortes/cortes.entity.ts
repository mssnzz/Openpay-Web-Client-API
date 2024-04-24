// Corte.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { POS } from '../pos/pos.entity';
export enum CorteEstado {
  ABIERTO = 'abierto',
  CERRADO = 'cerrado',
}

@Entity()
export class Corte {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => POS, (pos) => pos.cortes, { eager: true, nullable: false })
  @JoinColumn({ name: 'posId' })
  pos: POS;

  @Column('json')
  denominations: any; // Usar `jsonb` en caso de Postgres es más eficiente si necesitas indexar el contenido

  @Column()
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: CorteEstado,
    default: CorteEstado.ABIERTO,
  })
  estado: CorteEstado;
}
