import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(data: Partial<ProductEntity>): Promise<ProductEntity> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity> {
    await this.findOne(id);
    await this.productRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.findOne(id);
    await this.productRepo.delete(id);
    return { success: true };
  }
}
