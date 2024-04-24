import { CreatePriceDto } from './prices/price.dto';

export class CreateVariationDto {
  name: string;
  prices: CreatePriceDto[];
}
