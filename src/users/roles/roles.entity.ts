/* eslint-disable prettier/prettier */

// role.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../users.entity';
import { Permission } from '../permissions/permissions.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role) // Cambio a OneToMany si User tiene ManyToOne
  users: User[];
}
