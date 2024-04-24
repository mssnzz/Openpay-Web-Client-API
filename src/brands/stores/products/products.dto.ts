export class CreateProductDto {
  name: string;
  price: number;
  categoryIds: string[];
  storeIds: string[];
}
