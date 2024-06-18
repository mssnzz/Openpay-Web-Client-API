import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Store } from '../stores.entity';
import { Corte } from '../cortes/cortes.entity';
import { Order } from '../orders/orders.entity';
import { Payment } from '../payments/payments.entity';

@Entity()
export class POS {
  @PrimaryGeneratedColumn('uuid') // Genera automáticamente un UUID para cada instancia
  id: string; // Cambia el tipo de `number` a `string`

  @Column()
  name: string;

  @Column({ nullable: true })
  background: string;

  @Column({ default: 'inactive' })
  status: string;

  @Column()
  pairingCode: string;

  @OneToMany(() => Corte, (corte) => corte.pos)
  cortes: Corte[];

  @ManyToOne(() => Store, (store) => store.pos)
  store: Store;

  @OneToMany(() => Order, (order) => order.pos)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.pos)
  payments: Payment[];
}
