export class CreateCorteDto {
  posId: string; // Ensure this is not optional
  denominations: any;
  fecha: Date;
  total: number;
  estado: string;
}
