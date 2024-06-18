import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Payment } from './payments.entity';
import { CreatePaymentDto } from './create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({ relations: ['order', 'pos'] });
  }

  findOne(id: number): Promise<Payment> {
    const options: FindOneOptions<Payment> = {
      where: { id },
      relations: ['order', 'pos'],
    };
    return this.paymentsRepository.findOne(options);
  }
}
