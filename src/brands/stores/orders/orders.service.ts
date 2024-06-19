import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Order } from './orders.entity';
import { CreateOrderDto } from './create-order.dto';
import { POS } from '../pos/pos.entity';
import { CartItem } from './cart/items.entity';
import Store from '../stores.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(POS)
    private posRepository: Repository<POS>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { storeId, posId, cartItems, ...orderDetails } = createOrderDto;

    const store = await this.storesRepository.findOne({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const pos = await this.posRepository.findOne({ where: { id: posId } });
    if (!pos) {
      throw new NotFoundException(`POS with ID ${posId} not found`);
    }

    const order = this.ordersRepository.create({
      ...orderDetails,
      store,
      pos,
      cartItems: cartItems.map((item) => this.cartItemsRepository.create(item)),
    });

    return this.ordersRepository.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['store', 'pos', 'payments', 'cartItems'],
    });
  }

  findOne(id: number): Promise<Order> {
    const options: FindOneOptions<Order> = {
      where: { id },
      relations: ['store', 'pos', 'payments', 'cartItems'],
    };
    return this.ordersRepository.findOne(options);
  }
}
