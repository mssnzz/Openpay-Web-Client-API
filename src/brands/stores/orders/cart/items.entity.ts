import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from '../orders.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  barcode: string;

  @Column()
  cantidad: number;

  @Column()
  precioVenta: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Order, (order) => order.cartItems)
  order: Order;
}
