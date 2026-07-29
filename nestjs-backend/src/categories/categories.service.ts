import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(data: { name: string; description?: string }): Promise<CategoryEntity> {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = this.categoryRepo.create({ ...data, slug });
    return this.categoryRepo.save(category);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.findOne(id);
    await this.categoryRepo.delete(id);
    return { success: true };
  }
}
