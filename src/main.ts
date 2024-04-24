import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'; // Modificado aquí

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/uploads', express.static('uploads')); // Sirve archivos estáticos del directorio 'uploads'

  await app.listen(3003);
}
bootstrap();
