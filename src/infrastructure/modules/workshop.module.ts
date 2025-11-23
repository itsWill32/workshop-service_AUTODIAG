import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PrismaWorkshopRepository } from '../database/repositories/prisma-workshop.repository';
import { PrismaReviewRepository } from '../database/repositories/prisma-review.repository';

import {
  WorkshopsController,
  SpecialtiesController,
  ScheduleController,
  ReviewsController,
} from '../http/controllers';

import {
  CreateWorkshopUseCase,
  GetWorkshopsUseCase,
  GetWorkshopByIdUseCase,
  UpdateWorkshopUseCase,
  DeleteWorkshopUseCase,
  SearchNearbyWorkshopsUseCase,
} from '../../application/use-cases/workshop';

import {
  AddSpecialtyUseCase,
  GetSpecialtiesUseCase,
} from '../../application/use-cases/specialty';

import {
  SetWorkshopScheduleUseCase,
  GetWorkshopScheduleUseCase,
} from '../../application/use-cases/schedule';

import {
  CreateReviewUseCase,
  GetReviewsUseCase,
  UpdateReviewUseCase,
  DeleteReviewUseCase,
  RespondToReviewUseCase,
} from '../../application/use-cases/review';

import { AuthModule } from './auth.module';


@Module({
  imports: [AuthModule],
  controllers: [
    WorkshopsController,
    SpecialtiesController,
    ScheduleController,
    ReviewsController,
  ],
  providers: [
    PrismaService,

    {
      provide: 'IWorkshopRepository',
      useClass: PrismaWorkshopRepository,
    },
    {
      provide: 'IReviewRepository',
      useClass: PrismaReviewRepository,
    },



    CreateWorkshopUseCase,
    GetWorkshopsUseCase,
    GetWorkshopByIdUseCase,
    UpdateWorkshopUseCase,
    DeleteWorkshopUseCase,
    SearchNearbyWorkshopsUseCase,

    AddSpecialtyUseCase,
    GetSpecialtiesUseCase,

    SetWorkshopScheduleUseCase,
    GetWorkshopScheduleUseCase,

    CreateReviewUseCase,
    GetReviewsUseCase,
    UpdateReviewUseCase,
    DeleteReviewUseCase,
    RespondToReviewUseCase,
  ],
  exports: [
    PrismaService,
    'IWorkshopRepository',
    'IReviewRepository',
  ],
})
export class WorkshopModule {}