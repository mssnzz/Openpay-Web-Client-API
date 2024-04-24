// employee.controller.ts
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.entity';
import { CreateEmployeeDto, FindEmployeeDto } from './employees.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeeService: EmployeesService) {}

  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post('validate')
  async findByAccessCodeAndStoreId(
    @Body() findEmployeeDto: FindEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.findByAccessCodeAndStoreId(
      findEmployeeDto.accessCode,
      findEmployeeDto.storeId,
    );
  }

  @Patch(':id/toggle-clocked-in')
  async toggleClockedIn(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.toggleClockedIn(id);
  }

  @Post('login')
  async login(@Body() findEmployeeDto: FindEmployeeDto): Promise<Employee> {
    return this.employeeService.login(
      findEmployeeDto.accessCode,
      findEmployeeDto.storeId,
    );
  }

  @Get(':id')
  async getEmployeeById(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.getEmployeeById(id);
  }
  // Aquí puedes agregar más rutas según las necesidades de tu aplicación
}
