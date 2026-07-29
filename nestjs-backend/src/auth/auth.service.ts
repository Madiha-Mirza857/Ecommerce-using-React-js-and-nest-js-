import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async login(email: string, pass: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async register(data: Partial<UserEntity>): Promise<UserEntity> {
    const existing = await this.userRepo.findOne({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const newUser = this.userRepo.create({
      ...data,
      role: data.role || 'customer',
    });
    return this.userRepo.save(newUser);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepo.find({ order: { createdAt: 'DESC' } });
  }
}
