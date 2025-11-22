import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WorkshopModule } from './workshop.module';
import { AuthModule } from './auth.module';
import { HttpExceptionFilter } from '../http/filters/http-exception.filter';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    AuthModule,
    WorkshopModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, 
        forbidNonWhitelisted: true,
        transform: true, 
        transformOptions: {
          enableImplicitConversion: true, 
        },
      }),
    },
  ],
})
export class AppModule {}