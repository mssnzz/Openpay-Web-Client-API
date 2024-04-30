// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { PermissionModule } from './users/permissions/permissions.module';
import { RoleModule } from './users/roles/roles.module';
import { StoresController } from './brands/stores/stores.controller';
import { StoresService } from './brands/stores/stores.service';
import { StoresModule } from './brands/stores/stores.module';

import { PosModule } from './brands/stores/pos/pos.module';
import { LogsModule } from './users/logs/logs.module';
import { BrandsModule } from './brands/brands.module';
import { CortesModule } from './brands/stores/cortes/cortes.module';
import { EmployeePermissionsModule } from './brands/stores/employees/permissions/employees.permissions.module';
import { CategoryModule } from './brands/stores/products/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '167.71.20.37', // o la dirección del servidor de tu base de datos
      port: 1124, // el puerto por defecto de PostgreSQL
      username: 'postgres', // reemplaza con tu usuario de PostgreSQL
      password: '60eca3de9d8ebbe4abd2', // reemplaza con tu contraseña de PostgreSQL
      database: 'rabiasport', // reemplaza con el nombre de tu base de datos
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // especifica la ubicación de tus entidades
      synchronize: true, // en desarrollo puede estar en true para sincronizar el esquema de la bd automáticamente
      logging: false,
    }),
    UserModule,
    PermissionModule,
    RoleModule,
    StoresModule,
    PosModule,
    LogsModule,
    BrandsModule,
    CortesModule,
    EmployeePermissionsModule,
    CategoryModule,
  ],
  controllers: [StoresController],
  providers: [StoresService],
})
export class AppModule {
  constructor() {}
}
