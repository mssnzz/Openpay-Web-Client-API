import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './stores.entity';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { EmployeesModule } from './employees/employees.module';
import { CortesModule } from './cortes/cortes.module';
import Brands from '../brands.entity';
import { ProductModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    TypeOrmModule.forFeature([Brands]),
    EmployeesModule,
    CortesModule,
    ProductModule,
    OrdersModule,
    PaymentsModule,
  ],
  providers: [StoresService],
  controllers: [StoresController],
  exports: [TypeOrmModule.forFeature([Store])],
})
export class StoresModule {}
