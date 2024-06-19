import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './orders.entity';
import { POS } from '../pos/pos.entity';
import { CartItem } from './cart/items.entity';
import Store from '../stores.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Store, POS, CartItem])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
