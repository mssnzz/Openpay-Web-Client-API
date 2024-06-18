import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import Store from '../stores.entity';
import { Payment } from '../payments/payments.entity';
import { POS } from '../pos/pos.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalAmount: number;

  @Column()
  status: string;

  @ManyToOne(() => Store, (store) => store.orders)
  store: Store;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @ManyToOne(() => POS, (pos) => pos.orders)
  pos: POS;
}
