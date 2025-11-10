import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/modules/databasse.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { WorkshopModule } from './infrastructure/modules/workshop.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    WorkshopModule, // <-- ¡Esta es la importación clave!
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}