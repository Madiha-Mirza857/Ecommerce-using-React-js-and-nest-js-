import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column()
  categoryName: string;

  @ManyToOne(() => CategoryEntity, (cat) => cat.products, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column({ nullable: true })
  categoryId: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  composition: string;

  @Column({ nullable: true })
  careInstructions: string;

  @Column('decimal', { precision: 3, scale: 2, default: 5.0 })
  rating: number;

  @Column({ default: 0 })
  reviewsCount: number;

  @Column({ default: true })
  inStock: boolean;

  @Column({ default: false })
  isNewArrival: boolean;

  @Column({ default: false })
  isBestseller: boolean;

  @Column({ nullable: true })
  sustainabilityBadge: string;

  @Column('json')
  images: string[];

  @Column('json')
  colors: Array<{ name: string; hex: string }>;

  @Column('json')
  sizes: string[];

  @CreateDateColumn()
  createdAt: Date;
}
