import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import Store from './stores/stores.entity';

@Entity()
export class Brands {
  @PrimaryGeneratedColumn('uuid') // Genera automáticamente un UUID para cada instancia
  id: string; // Cambia el tipo de `number` a `string`

  @Column({ length: 100 })
  name: string;

  @Column('text')
  logoUrl: string;

  @Column('text', { default: 'Retail' })
  category: string;

  // Relación con la entidad User
  @ManyToMany(() => User, (user) => user.brands)
  @JoinTable() // Esto indica que esta entidad es propietaria de la relación y contiene la tabla de unión.
  users: User[];

  @OneToMany(() => Store, (store) => store.brand)
  stores: Store[];
}

export default Brands;
