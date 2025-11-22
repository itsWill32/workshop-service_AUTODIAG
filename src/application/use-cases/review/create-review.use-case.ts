import { Injectable } from '@nestjs/common';
import { IWorkshopRepository, IReviewRepository } from '../../../domain/repositories';
import {
  WorkshopNotFoundException,
  WorkshopInactiveException,
} from '../../../domain/exceptions/workshop.exceptions';
import { DuplicateReviewException } from '../../../domain/exceptions/review.exceptions';
import { Review } from '../../../domain/entities';
import { Rating, Comment } from '../../../domain/value-objects';
import { CreateReviewDto } from '../../dtos/request';
import { ReviewDto } from '../../dtos/response';
import { ReviewMapper } from '../../mappers';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class CreateReviewUseCase {
  constructor(
    private readonly workshopRepository: IWorkshopRepository,
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(
    workshopId: string,
    userId: string,
    userName: string,
    userAvatar: string | null,
    dto: CreateReviewDto,
  ): Promise<ReviewDto> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    if (!workshop.getIsActive()) {
      throw new WorkshopInactiveException(workshopId);
    }

    if (dto.appointmentId) {
      const existingReview = await this.reviewRepository.findByAppointmentId(
        dto.appointmentId,
      );
      if (existingReview) {
        throw new DuplicateReviewException(userId, dto.appointmentId);
      }
    }

    const overallRating = Rating.create(dto.rating.overall);
    const qualityRating = dto.rating.quality ? Rating.create(dto.rating.quality) : null;
    const priceRating = dto.rating.price ? Rating.create(dto.rating.price) : null;
    const timeComplianceRating = dto.rating.timeCompliance
      ? Rating.create(dto.rating.timeCompliance)
      : null;
    const customerServiceRating = dto.rating.customerService
      ? Rating.create(dto.rating.customerService)
      : null;

    const comment = dto.comment ? Comment.create(dto.comment) : null;

    const review = Review.create(
      uuidv4(),
      workshopId,
      userId,
      userName,
      userAvatar,
      dto.appointmentId || null,
      overallRating,
      qualityRating,
      priceRating,
      timeComplianceRating,
      customerServiceRating,
      comment,
    );

    const savedReview = await this.reviewRepository.save(review);

    workshop.updateRating(dto.rating.overall);
    await this.workshopRepository.save(workshop);



    return ReviewMapper.toDto(savedReview);
  }
}