// src/stores/dto/create-store.dto.ts

export class CreateStoreDto {
  name: string;
  address: string;
  city?: string;
  phone?: string;
  brandUuid: string; // UUID de la marca a la que pertenecerá la tienda
}
