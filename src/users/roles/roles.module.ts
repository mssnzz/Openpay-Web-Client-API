// role.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './roles.service';
import { RoleController } from './roles.controller';
import { Role } from './roles.entity';
import { PermissionModule } from '../permissions/permissions.module'; // Importar PermissionModule

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule], // Añadir PermissionModule a los imports
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService, TypeOrmModule.forFeature([Role])], // Asegúrate de exportar el repositorio
})
export class RoleModule {}
