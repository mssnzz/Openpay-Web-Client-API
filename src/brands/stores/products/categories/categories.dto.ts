// create-category.dto.ts
export class CreateCategoryDto {
  name: string;
  storeId: string; // Asume que la relación con Store se maneja mediante un ID externo
  color: string;
}
