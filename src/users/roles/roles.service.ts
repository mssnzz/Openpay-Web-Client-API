/* eslint-disable prettier/prettier */
// role.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { PermissionService } from '../permissions/permissions.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private permissionService: PermissionService, // Inyectar PermissionService
  ) {}

  async createRole(name: string, permissionIds: number[]): Promise<Role> {
    if (
      !permissionIds ||
      !Array.isArray(permissionIds) ||
      permissionIds.length === 0
    ) {
      throw new Error('permissionIds debe ser un array no vacío de IDs.');
    }

    const permissions = await this.permissionService.findByIds(permissionIds);
    const newRole = this.roleRepository.create({ name, permissions });
    return this.roleRepository.save(newRole);
  }

  async findByName(name: string): Promise<Role | undefined> {
    return this.roleRepository.findOne({ where: { name } });
  }

  async findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find(); // Utiliza el método find() del repositorio para obtener todos los roles
  }

  async findAllRolesWithPermissions(): Promise<any[]> {
    const allPermissions = await this.permissionService.findAll();
    const roles = await this.roleRepository.find({
      relations: ['permissions'],
    });

    const rolesWithPermissions = roles.map((role) => {
      return {
        ...role,
        allPermissions,
        assignedPermissions: role.permissions,
      };
    });

    return rolesWithPermissions;
  }
  async togglePermission(roleId: number, permissionId: number): Promise<Role> {
    // Comprobar si la relación ya existe
    const existingRelation = await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.permissions', 'permission', 'permission.id = :permissionId', { permissionId })
      .where('role.id = :roleId', { roleId })
      .getOne();
  
    const action = existingRelation ? 'remove' : 'add';
  
    await this.roleRepository
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)[action](permissionId);
  
    // Devolver el rol actualizado con sus permisos
    return this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });
  }
}
