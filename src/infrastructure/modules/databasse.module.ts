import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        // Asegúrate que tu .env tenga la URL con ?schema=workshop
        return new PrismaClient();
      },
    },
  ],
  exports: [PrismaClient],
})
export class DatabaseModule {}