/* eslint-disable prettier/prettier */
// role.controller.ts
import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { RoleService } from './roles.service';
import { Role } from './roles.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(
    @Body() roleData: { name: string; permissionIds: number[] },
  ): Promise<Role> {
    return this.roleService.createRole(roleData.name, roleData.permissionIds);
  }

  // Método nuevo para obtener todos los roles
  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAllRolesWithPermissions();
  }

  @Patch('/:roleId/permissions/:permissionId')
  async toggleRolePermission(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number,
  ): Promise<Role> {
    return this.roleService.togglePermission(roleId, permissionId);
  }
}
