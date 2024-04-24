// create-employee.dto.ts
export class CreateEmployeeDto {
  name: string;
  email: string;
  position: string;
  startDate?: Date;
  passcode?: number;
  phoneNumber?: string;
  storeId: string; // Asume que pasas el ID de la tienda para vincular el empleado a una tienda específica
}
export class FindEmployeeDto {
  accessCode: number;
  storeId: string;
}
