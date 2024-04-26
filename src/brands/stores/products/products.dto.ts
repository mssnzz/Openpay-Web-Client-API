import { CreateVariationDto } from './variations/variations.dto';

export class CreateProductDto {
  name: string;
  description: string;
  barcode?: string; // Optional barcode field if you need to include it
  status: string = 'trash'; // Default status, can be overridden
  imageUrl?: string;
  precioCompra?: string;
  precioVenta?: string;
  stockAvailable?: string;
  minimumStock?: string;
  categoryIds: string[]; // IDs of categories to link the product
  storeIds: string[]; // IDs of stores to link the product
  variations: CreateVariationDto[]; // List of variations to be created with the product
}
