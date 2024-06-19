import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './users.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; // Esto es crucial para que AuthGuard sea reconocido
import { Request } from 'express'; // Asegúrate de importar Request de Express

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
      storeId?: string; // storeId es opcional
      password: string; // Añade el campo password
      brandId: string;
    },
  ): Promise<User> {
    // Pasar todos los datos incluyendo la contraseña al servicio de creación de usuarios
    return this.userService.create(
      userData.name,
      userData.email,
      userData.roleId,
      userData.accessPin,
      userData.brandId,
      userData.storeId || null, // Asegúrate de que storeId puede ser null
      userData.password, // Asegúrate de pasar la contraseña
    );
  }

  @Get()
  async findAll(@Query('storeId') storeId?: string): Promise<User[]> {
    return this.userService.findAll(storeId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getUserProfile(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1]; // Correctamente tipado como parte de Request de Express
    if (!token) {
      return { error: 'No token provided' };
    }
    const user = await this.userService.getUserFromToken(token);
    if (user) {
      return { user };
    } else {
      return { error: 'User not found' };
    }
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
  @Post('register')
  async registerUser(
    @Body()
    userData: {
      name: string;
      email: string;
      password: string; // Añade el campo password
    },
  ): Promise<User> {
    // Pasar todos los datos incluyendo la contraseña al servicio de creación de usuarios
    return this.userService.registerUser(
      userData.name,
      userData.email,
      userData.password, // Incluir la contraseña
    );
  }

  @Post(':userId/assign-brand/:brandId')
  async assignUserToBrand(
    @Param('userId') userId: number,
    @Param('brandId') brandId: number,
  ): Promise<any> {
    try {
      const updatedUser = await this.userService.assignUserToBrand(
        userId,
        brandId,
      );
      return {
        status: HttpStatus.OK,
        message: 'User successfully assigned to brand',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Post(':userId/assign-store/:storeId')
  async assignStore(
    @Param('userId') userId: number,
    @Param('storeId') storeId: string,
  ): Promise<any> {
    try {
      const updatedUser = await this.userService.assignStoreToUser(
        userId,
        storeId,
      );
      return {
        status: HttpStatus.OK,
        message: 'Store successfully assigned to user',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
