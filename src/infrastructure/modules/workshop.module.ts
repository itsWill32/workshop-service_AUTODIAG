import { Module } from '@nestjs/common';
import { DatabaseModule } from './databasse.module';
import { WorkshopsController } from '../adapters/input/rest/workshop.controller';
import { WorkshopService } from '../../application/use-cases/workshop.service';
import { WORKSHOP_REPOSITORY } from '../../domain/interfaces/workshop.repository.interface';
import { PrismaWorkshopRepository } from '../adapters/output/persistence/risma-workshop.repository';

@Module({
  imports: [DatabaseModule], // Importa el PrismaClient
  controllers: [WorkshopsController],
  providers: [
    WorkshopService,
    {
      provide: WORKSHOP_REPOSITORY,
      useClass: PrismaWorkshopRepository,
    },
  ],
})
export class WorkshopModule {}