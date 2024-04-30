// employee.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employees.entity';
import { CreateEmployeeDto } from './employees.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepository.create(createEmployeeDto);
    return this.employeesRepository.save(employee);
  }

  async findByAccessCodeAndStoreId(
    accessCode: number,
    storeId: string,
  ): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { passcode: accessCode, store: { id: storeId } },
      relations: ['store'], // Asegúrate de cargar la relación con la tienda si es necesario para la respuesta
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with access code ${accessCode} not found`,
      );
    }

    return employee;
  }

  async toggleClockedIn(employeeId: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found.`);
    }

    employee.clockedIn = !employee.clockedIn;
    await this.employeesRepository.save(employee);
    return employee;
  }

  async login(accessCode: number, storeId: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { passcode: accessCode, store: { id: storeId } },
      relations: ['store'], // Si necesitas cargar relaciones
    });

    if (!employee) {
      throw new NotFoundException(`Employee not found.`);
    }
    return employee;
  }

  async getEmployeeById(id: string): Promise<Employee> {
    // Uso correcto de findOne con un objeto de opciones
    const employee = await this.employeesRepository.findOne({
      where: { id }, // Especifica que estás buscando basado en el campo 'id'
      relations: ['employeePermissions'], // Asegúrate de que 'permissions' es el nombre correcto de la relación
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  // Aquí puedes agregar más métodos según las necesidades de tu aplicación
}
