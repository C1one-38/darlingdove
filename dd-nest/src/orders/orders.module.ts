import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderSchema } from './schemas/order.schema';
import { CartsModule } from '../carts/carts.module';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { PromocodesModule } from '../promocodes/promocodes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    AuthModule,
    ProductsModule,
    MailModule,
    forwardRef(() => CartsModule),
    forwardRef(() => PromocodesModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
