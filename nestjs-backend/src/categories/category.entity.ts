import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ProductEntity } from '../products/product.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
id: string;
  @Column({ unique: true })  
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
