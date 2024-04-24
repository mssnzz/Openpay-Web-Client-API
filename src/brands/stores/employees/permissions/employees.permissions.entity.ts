import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../employees.entity';

@Entity()
export class EmployeePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.employeePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  permissionName: string; // Nombre del permiso asignado al empleado

  // Puedes añadir más campos aquí si necesitas, como fechas, estado, etc.
}
