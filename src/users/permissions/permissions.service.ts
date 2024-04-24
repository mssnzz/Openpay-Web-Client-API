/* eslint-disable prettier/prettier */
// permission.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permissions.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(name: string): Promise<Permission> {
    const newPermission = this.permissionRepository.create({ name });
    return this.permissionRepository.save(newPermission);
  }

  async findByName(name: string): Promise<Permission | undefined> {
    return this.permissionRepository.findOne({ where: { name } });
  }
  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }
  async findByIds(ids: number[]): Promise<Permission[]> {
    return this.permissionRepository.findByIds(ids);
  }
  async findAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }
  async findOne(id: number): Promise<Permission | undefined> {
    return this.permissionRepository.findOne({ where: { id } });
  }
  

  // Método para buscar todos los permisos, etc.
}
