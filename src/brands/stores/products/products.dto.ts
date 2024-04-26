// CreateProductDto now includes a field for variations

import { CreateVariationDto } from './variations/variations.dto';

export class CreateProductDto {
  name: string;
  description: string;
  categoryIds: string[];
  storeIds: string[];
  variations: CreateVariationDto[]; // Assuming CreateVariationDto correctly represents the data needed for a variation
}
