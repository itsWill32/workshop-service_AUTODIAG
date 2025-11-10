// autodiag-workshop-service/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// --- AÑADE ESTA LÍNEA ---
import { ValidationPipe } from '@nestjs/common'; 
// --- AÑADE ESTA LÍNEA ---
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // Ahora 'ValidationPipe' será reconocido
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Ahora 'DocumentBuilder' será reconocido
  const config = new DocumentBuilder()
    .setTitle('Workshop Service API')
    .setDescription('Servicio de gestión de talleres mecánicos para AutoDiag.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  
  // Ahora 'SwaggerModule' será reconocido
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3003;
  await app.listen(port);
  
  console.log(`🚀 WorkshopService está corriendo en: http://localhost:${port}`);
}
bootstrap();