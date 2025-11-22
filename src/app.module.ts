import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/modules/auth.module';
import { WorkshopModule } from './infrastructure/modules/workshop.module';
export { AppModule } from './infrastructure/modules/app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppModule,
    AuthModule,
    WorkshopModule, // <-- ¡Esta es la importación clave!
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}