// employees.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './employees.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])], // Registrar la entidad Employee para inyección en el servicio
  controllers: [EmployeesController], // Registrar el controlador
  providers: [EmployeesService], // Registrar el servicio
  exports: [EmployeesService], // Opcional: exportar el servicio si se va a utilizar fuera de este módulo
})
export class EmployeesModule {}
