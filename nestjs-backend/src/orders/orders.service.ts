import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly itemRepo: Repository<OrderItemEntity>,
  ) {}

  async findAll(email?: string): Promise<OrderEntity[]> {
    if (email) {
      return this.orderRepo.find({
        where: { customerEmail: email },
        relations: ['items'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.orderRepo.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(data: {
    customerName: string;
    customerEmail: string;
    address: string;
    city: string;
    country: string;
    items: Array<{
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      color?: string;
      size?: string;
      image: string;
    }>;
    subtotal: number;
    totalAmount: number;
    paymentMethod?: string;
    giftWrap?: boolean;
  }): Promise<OrderEntity> {
    const newOrder = this.orderRepo.create({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      address: data.address,
      city: data.city,
      country: data.country,
      subtotal: data.subtotal,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod || 'card',
      giftWrap: data.giftWrap || false,
      status: 'Pending',
    });

    const savedOrder = await this.orderRepo.save(newOrder);

    const items = data.items.map((item) =>
      this.itemRepo.create({
        order: savedOrder,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: item.image,
      }),
    );

    await this.itemRepo.save(items);
    return this.findOne(savedOrder.id);
  }

  async updateStatus(id: string, status: string): Promise<OrderEntity> {
    await this.findOne(id);
    await this.orderRepo.update(id, { status });
    return this.findOne(id);
  }
}
