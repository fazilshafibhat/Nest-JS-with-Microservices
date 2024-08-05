import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  // async createOrder(request: CreateOrderRequest, authentication: string) {
  //   const session = await this.ordersRepository.startTransaction();
  //   try {
  //     const order = await this.ordersRepository.create(request, { session });
  //     await lastValueFrom(
  //       this.billingClient.emit('order_created', {
  //         request,
  //         Authentication: authentication,
  //       }),
  //     );
  //     await session.commitTransaction();
  //     return order;
  //   } catch (err) {
  //     await session.abortTransaction();
  //     throw err;
  //   }
  // }

  async createOrder(request: CreateOrderRequest, authentication: string) {
    // Directly create the order without starting a transaction
    const order = await this.ordersRepository.create(request);
  
    // Emit event or perform additional actions without a transaction
    await lastValueFrom(
      this.billingClient.emit('order_created', {
        request,
        Authentication: authentication,
      }),
    );
  
    return order;
  }
  

  async getOrders() {
    return this.ordersRepository.find({});
  }
}