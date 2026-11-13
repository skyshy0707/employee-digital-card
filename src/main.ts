import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true, // разрешает запросы с любых источников (для разработки)
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization'
    },
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  
  await (
    process.env.NODE_ENV == 'production' ? 
    app.listen(process.env.PORT ?? 3000, '0.0.0.0') : 
    app.listen(process.env.PORT ?? 3000)
  )
}
bootstrap();
