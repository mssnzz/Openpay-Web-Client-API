// categories.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import Store from '../../stores.entity';
import { Product } from '../products.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => Store, (store) => store.categories)
  store: Store;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
