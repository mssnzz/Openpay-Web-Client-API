// employee-permissions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeePermission } from './employees.permissions.entity';
import { Employee } from '../employees.entity';

@Injectable()
export class EmployeePermissionsService {
  constructor(
    @InjectRepository(EmployeePermission)
    private employeePermissionRepository: Repository<EmployeePermission>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async addPermissions(
    employeeId: string,
    permissions: { name: string; level: number }[],
  ): Promise<EmployeePermission[]> {
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions must be an array');
    }

    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const permissionEntities = permissions.map((permission) => {
      const perm = new EmployeePermission();
      perm.employee = employee;
      perm.permissionName = permission.name;
      return perm;
    });

    return this.employeePermissionRepository.save(permissionEntities);
  }
}
