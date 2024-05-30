// products.dto.ts
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVariationDto } from './variations/variations.dto';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  precioCompra?: string;

  @IsOptional()
  @IsString()
  precioVenta?: string;

  @IsOptional()
  @IsString()
  stockAvailable?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsUUID('4', { each: true })
  storeIds?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateVariationDto)
  variations?: CreateVariationDto[];

  @IsOptional()
  @IsBoolean()
  isService?: boolean; // Nuevo campo para indicar si el producto es un servicio
}
