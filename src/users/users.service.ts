// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { Role } from './roles/roles.entity';
import Store from '../brands/stores/stores.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import Brands from 'src/brands/brands.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Store) // Asegúrate de inyectar el repositorio de Store
    private storeRepository: Repository<Store>,
    private jwtService: JwtService,
    @InjectRepository(Brands) // Inyecta el repositorio de Brands
    private brandsRepository: Repository<Brands>,
  ) {}

  async create(
    name: string,
    email: string,
    roleId: number,
    accessPin: number,
    storeId: string,
    password: string, // Añade la contraseña como un parámetro
  ): Promise<User> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new Error('Role not found');
    }

    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store) {
      throw new Error('Store not found');
    }

    // Hashea la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      name,
      email,
      role,
      accessPin,
      store,
      password: hashedPassword, // Almacena la contraseña hasheada
    });

    return this.usersRepository.save(newUser);
  }

  async findAll(storeId?: string): Promise<User[]> {
    // Actualizado a string para UUID
    if (storeId) {
      return this.usersRepository.find({
        where: { store: { id: storeId } },
        relations: ['role', 'store'],
      });
    }
    return this.usersRepository.find({
      relations: ['role', 'store'],
    });
  }
  async findOneWithRolesAndPermissions(userId: any): Promise<User> {
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions'], // Asume que 'role' es la relación en User y 'permissions' en Role
    });
  }
  async findOneByName(name: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { name } });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }
  async update(
    userId: number,
    newName?: string,
    newAccessPin?: number,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Actualiza solo los campos proporcionados
    if (newName !== undefined) {
      user.name = newName;
    }
    if (newAccessPin !== undefined) {
      user.accessPin = newAccessPin;
    }

    // Guarda los cambios en la base de datos
    await this.usersRepository.save(user);

    return user;
  }
  async findByAccessPinAndStoreId(
    accessPin: number, // Espera un número
    storeId: string, // Espera un número
  ): Promise<User | undefined> {
    console.log(accessPin);
    console.log(storeId);
    return this.usersRepository.findOne({
      where: {
        accessPin: accessPin,
        store: { id: storeId },
      },
      relations: ['role', 'store'],
    });
  }
  async toggleClockedIn(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.clockedIn = !user.clockedIn;
    return this.usersRepository.save(user);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser(
    name: string,
    email: string,
    password: string, // Añade la contraseña como un parámetro
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword, // Almacena la contraseña hasheada
    });

    return this.usersRepository.save(newUser);
  }

  async assignUserToBrand(userId: number, brandId: any): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['brands'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    const brand = await this.brandsRepository.findOne({
      where: { id: brandId },
    });
    if (!brand) {
      throw new Error('Brand not found');
    }

    user.brands = brand;
    return this.usersRepository.save(user);
  }

  async getUserFromToken(token: string): Promise<User | undefined> {
    try {
      const decoded = this.jwtService.verify(token);
      if (decoded?.sub) {
        return this.usersRepository.findOne({
          where: { id: decoded.sub },
          relations: ['role', 'store', 'brands'], // Asegúrate de cargar las relaciones necesarias
        });
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  // Method to assign a store to a user
  async assignStoreToUser(userId: number, storeId: string): Promise<User> {
    // Fetch the user and the store from the database
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['store'], // Ensure 'store' relationship is loaded to avoid overwriting existing relations if any
    });
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    // Check if the user and store actually exist
    if (!user) {
      throw new Error('User not found');
    }
    if (!store) {
      throw new Error('Store not found');
    }

    // Assign the store to the user
    user.store = store;

    // Save the updated user entity
    return this.usersRepository.save(user);
  }
}
