import { CreatePriceDto } from './prices/price.dto';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  stock: number; // Changed from string to number

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePriceDto)
  prices: CreatePriceDto[];
}
