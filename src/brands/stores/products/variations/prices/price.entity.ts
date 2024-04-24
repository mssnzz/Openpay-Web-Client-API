import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Variation } from '../variations.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  conditions: string; // Esto puede ser un JSON o simplemente un texto explicativo.

  @ManyToOne(() => Variation, (variation) => variation.prices)
  variation: Variation;
}
