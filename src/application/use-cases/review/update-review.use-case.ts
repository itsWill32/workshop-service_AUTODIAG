import { Injectable } from '@nestjs/common';
import { IReviewRepository } from '../../../domain/repositories';
import {
  ReviewNotFoundException,
  ReviewNotOwnedByUserException,
} from '../../../domain/exceptions/review.exceptions';
import { Rating, Comment } from '../../../domain/value-objects';
import { UpdateReviewDto } from '../../dtos/request';
import { ReviewDto } from '../../dtos/response';
import { ReviewMapper } from '../../mappers';


@Injectable()
export class UpdateReviewUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(
    workshopId: string,
    reviewId: string,
    userId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewDto> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new ReviewNotFoundException(reviewId);
    }

    if (review.getUserId() !== userId) {
      throw new ReviewNotOwnedByUserException(reviewId, userId);
    }

    if (review.getWorkshopId() !== workshopId) {
      throw new Error('La reseña no pertenece a este taller');
    }

    let overallRating: Rating | undefined;
    let qualityRating: Rating | null | undefined;
    let priceRating: Rating | null | undefined;
    let timeComplianceRating: Rating | null | undefined;
    let customerServiceRating: Rating | null | undefined;

    if (dto.rating) {
      overallRating = Rating.create(dto.rating.overall);
      qualityRating = dto.rating.quality ? Rating.create(dto.rating.quality) : null;
      priceRating = dto.rating.price ? Rating.create(dto.rating.price) : null;
      timeComplianceRating = dto.rating.timeCompliance
        ? Rating.create(dto.rating.timeCompliance)
        : null;
      customerServiceRating = dto.rating.customerService
        ? Rating.create(dto.rating.customerService)
        : null;
    }

    let comment: Comment | null | undefined;
    if (dto.comment !== undefined) {
      comment = dto.comment ? Comment.create(dto.comment) : null;
    }

    review.update(
      overallRating,
      qualityRating,
      priceRating,
      timeComplianceRating,
      customerServiceRating,
      comment,
    );

    const updatedReview = await this.reviewRepository.save(review);



    return ReviewMapper.toDto(updatedReview);
  }
}