// employee-permissions.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { EmployeePermissionsService } from './employees.permissions.service';

@Controller('employee-permissions')
export class EmployeePermissionsController {
  constructor(
    private readonly employeePermissionsService: EmployeePermissionsService,
  ) {}

  @Post(':employeeId')
  addPermissionsToEmployee(
    @Param('employeeId') employeeId: string,
    @Body('permissions') permissions: { name: string; level: number }[],
  ) {
    return this.employeePermissionsService.addPermissions(
      employeeId,
      permissions,
    );
  }
}
