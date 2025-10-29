import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import ConnectionDB from './DB/connection/connection.DB';
import { OtpModel } from './DB/models/otp.model';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:"./config/.env",
    isGlobal:true,
  }),
 ConnectionDB(),
UserModule,
AuthModule
]
,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 