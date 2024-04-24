import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from '../products.entity';
import { Price } from './prices/price.entity';

@Entity()
export class Variation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Product, (product) => product.variations)
  product: Product;

  @OneToMany(() => Price, (price) => price.variation)
  prices: Price[];
}
