/* eslint-disable prettier/prettier */
// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from './roles/roles.entity';
import { Store } from '../brands/stores/stores.entity';
import { Brands } from 'src/brands/brands.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  accessPin: number;

  @Column({ nullable: false, default: false })
  clockedIn: boolean;

  @ManyToOne(() => Role, role => role.users) // La relación ManyToOne con Role
  role: Role; // Asegúrate de que la propiedad se llame 'role'

  @ManyToOne(() => Store, store => store.users)
  store: Store;

  @ManyToOne(() => Brands, brands => brands.users)
  brands: Brands;

  // Puedes agregar más campos según necesites
}
