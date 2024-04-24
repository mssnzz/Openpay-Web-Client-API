/* eslint-disable prettier/prettier */
// permission.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PermissionService } from './permissions.service';
import { Permission } from './permissions.entity';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() permissionData: { name: string }): Promise<Permission> {
    return this.permissionService.createPermission(permissionData.name);
  }

  // @Get(), etc.
}
