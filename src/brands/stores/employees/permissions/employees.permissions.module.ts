// employee-permissions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeePermission } from './employees.permissions.entity';
import { EmployeePermissionsService } from './employees.permissions.service';
import { Employee } from '../employees.entity';
import { EmployeePermissionsController } from './employees.permissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeePermission, Employee])],
  controllers: [EmployeePermissionsController],
  providers: [EmployeePermissionsService],
})
export class EmployeePermissionsModule {}
