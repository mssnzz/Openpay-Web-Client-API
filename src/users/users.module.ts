// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { User } from './users.entity';
import { UserController } from './users.controller'; // Importa el controlador
import { RoleModule } from './roles/roles.module';
import { PermissionModule } from './permissions/permissions.module';
import { StoresModule } from 'src/brands/stores/stores.module';
import { LogsModule } from './logs/logs.module';
import Store from 'src/brands/stores/stores.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
    PermissionModule,
    StoresModule,
    LogsModule,
    TypeOrmModule.forFeature([Store]),
    JwtModule.register({
      secret: 'tu_super_secreto', // Usa una cadena secreta compleja y guárdala en variables de entorno
      signOptions: { expiresIn: '60m' }, // El token expira en 60 minutos
    }),
  ],
  controllers: [UserController], // Añade el controlador aquí
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
