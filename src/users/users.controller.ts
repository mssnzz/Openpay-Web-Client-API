import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './users.entity';
import { AuthService } from './auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('findByAccessPinAndStoreId')
  async findByAccessPinAndStoreId(
    @Query('accessPin') accessPin: string,
    @Query('storeId') storeId: string,
  ): Promise<User | undefined> {
    const numericAccessPin = parseInt(accessPin, 10);
    return this.userService.findByAccessPinAndStoreId(
      numericAccessPin,
      storeId,
    );
  }

  @Post()
  async create(
    @Body()
    userData: {
      name: string;
      email: string;
      roleId: any; // Cambiado a string para UUID
      accessPin: number;
      storeId: string;
      password: string; // Añade el campo password
    },
  ): Promise<User> {
    // Pasar todos los datos incluyendo la contraseña al servicio de creación de usuarios
    return this.userService.create(
      userData.name,
      userData.email,
      userData.roleId,
      userData.accessPin,
      userData.storeId,
      userData.password, // Incluir la contraseña
    );
  }

  @Get()
  async findAll(@Query('storeId') storeId?: string): Promise<User[]> {
    return this.userService.findAll(storeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: any): Promise<User> {
    // Actualiza el tipo de parámetro a string para UUID
    return this.userService.findOneWithRolesAndPermissions(id);
  }

  @Patch(':id/toggle-clocked-in')
  async toggleClockedIn(@Param('id') id: number): Promise<User> {
    // Actualiza el tipo de parámetro a string para UUID
    return this.userService.toggleClockedIn(id);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}
