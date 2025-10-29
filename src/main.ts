import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import "src/common/services/Events/sendEmail.events"; 


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
  whitelist:true,
  stopAtFirstError:true,
  forbidNonWhitelisted:true
  }))
 app.enableCors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
});

const port=process.env.PORT ?? 5000
  await app.listen(port).then(()=>{
    console.log(`Application is running on port ${port}`);
    
  });
}
bootstrap();
