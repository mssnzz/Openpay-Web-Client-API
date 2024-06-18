import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from '../orders/orders.entity';
import { POS } from '../pos/pos.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  amountPaid: number;

  @Column()
  change: number;

  @Column()
  paymentDate: Date;

  @Column()
  paymentMethod: string;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;

  @ManyToOne(() => POS, (pos) => pos.payments)
  pos: POS;
}
