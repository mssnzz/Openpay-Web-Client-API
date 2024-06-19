class CreateCartItemDto {
  name: string;
  barcode: string;
  cantidad: number;
  precioVenta: number;
  imageUrl?: string;
}

export class CreateOrderDto {
  totalAmount: number;
  status: string;
  storeId: string; // UUID
  posId: string; // UUID
  cartItems: CreateCartItemDto[];
}
