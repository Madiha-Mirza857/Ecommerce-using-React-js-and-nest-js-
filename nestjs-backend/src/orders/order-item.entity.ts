import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from 'src/products/product.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @Column()
  orderId: string;

  @Column({ nullable: true })
  productId: string;

  @Column()
  productName: string;

  @Column()
  image: string;
 
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  size: string;

  @ManyToOne(() => ProductEntity, { onDelete: 'SET NULL' })
@JoinColumn({ name: 'productId' })
product: ProductEntity;
}
