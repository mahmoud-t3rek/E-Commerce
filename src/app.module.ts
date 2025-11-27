import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import ConnectionDB from './DB/connection/connection.DB';
import { OtpModel } from './DB/models/otp.model';
import { BrandModule } from './module/brand/brand.module';
import { categoryModule } from './module/catgory/catogery.module';
import { SubcategoryModule } from './module/Supcatgory/Subcatogery.module';
import { ProductModule } from './module/product/product.module';
import { CartModule } from './module/Cart/Cart.module';


@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:"./config/.env",
    isGlobal:true,
  }),
 ConnectionDB(),
UserModule,
BrandModule,
categoryModule,
SubcategoryModule,
ProductModule,
CartModule
]
,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  