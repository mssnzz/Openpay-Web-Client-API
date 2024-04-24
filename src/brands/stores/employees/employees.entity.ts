import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import Store from '../stores.entity';
import { EmployeePermission } from './permissions/employees.permissions.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  position: string; // Puesto o cargo del empleado dentro de la empresa

  @Column({ nullable: true })
  passcode: number; // PIN de acceso para sistemas internos, si aplica

  @Column({ nullable: true })
  phoneNumber: string; // Número de teléfono del empleado

  @Column({ nullable: false, default: false })
  clockedIn: boolean; // Número de teléfono del empleado

  // Relación ManyToOne con Store, asumiendo que un empleado puede trabajar en una sola tienda
  @ManyToOne(() => Store, (store) => store.employees, { eager: true })
  store: Store;

  @OneToMany(
    () => EmployeePermission,
    (employeePermission) => employeePermission.employee,
  )
  employeePermissions: EmployeePermission[];

  // Aquí puedes agregar más campos según las necesidades de tu aplicación
}
