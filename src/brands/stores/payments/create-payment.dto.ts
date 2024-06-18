export class CreatePaymentDto {
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  orderId: number;
  posId: number;
}
