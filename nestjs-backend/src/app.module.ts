import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UploadController } from './upload/upload.controller';

import { UserEntity } from './users/user.entity';
import { CategoryEntity } from './categories/category.entity';
import { ProductEntity } from './products/product.entity';
import { OrderEntity } from './orders/order.entity';
import { OrderItemEntity } from './orders/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: Number(3306),
      username: 'root',
      password: 'madiha123',
      database: 'atelier_ecommerce',
      entities: [
        UserEntity,
        CategoryEntity,
        ProductEntity,
        OrderEntity,
        OrderItemEntity,
      ],
      synchronize: false,
    }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
  ],
  controllers: [UploadController],
})
export class AppModule {}
