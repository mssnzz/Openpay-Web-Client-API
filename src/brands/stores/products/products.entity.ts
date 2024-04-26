import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Category } from './categories/categories.entity';
import Store from '../stores.entity';
import { Variation } from './variations/variations.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ default: 'trash' })
  status: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  precioCompra: string;

  @Column({ nullable: true })
  precioVenta: string;

  @Column({ nullable: true })
  stockAvailable: string;

  @Column({ nullable: true })
  minimumStock: string;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable() // This decorator specifies that this is the owner side of the relationship
  categories: Category[];

  @ManyToMany(() => Store, (store) => store.products)
  @JoinTable({
    name: 'store_products_product',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'storeId',
      referencedColumnName: 'id',
    },
  })
  stores: Store[];

  @OneToMany(() => Variation, (variation) => variation.product)
  variations: Variation[];
}
