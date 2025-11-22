import { Review } from '../../domain/entities';
import { ReviewDto, SentimentDto, RatingBreakdownResponseDto } from '../dtos/response';


export class ReviewMapper {

  static toDto(review: Review): ReviewDto {
    let sentiment: SentimentDto | null = null;
    if (review.getSentimentLabel() && review.getSentimentScore() !== null) {
      sentiment = {
        label: review.getSentimentLabel()!,
        score: review.getSentimentScore()!,
      };
    }

    const rating: RatingBreakdownResponseDto = {
      overall: review.getOverallRating(),
      quality: review.getQualityRating(),
      price: review.getPriceRating(),
      timeCompliance: review.getTimeComplianceRating(),
      customerService: review.getCustomerServiceRating(),
    };

    return {
      id: review.getId(),
      workshopId: review.getWorkshopId(),
      userId: review.getUserId(),
      userName: review.getUserName(),
      userAvatar: review.getUserAvatar(),
      appointmentId: review.getAppointmentId(),
      rating,
      comment: review.getComment(),
      sentiment,
      workshopResponse: review.getWorkshopResponse(),
      respondedAt: review.getRespondedAt(),
      isVerified: review.getIsVerified(),
      createdAt: review.getCreatedAt(),
      updatedAt: review.getUpdatedAt(),
    };
  }


  static toDtoArray(reviews: Review[]): ReviewDto[] {
    return reviews.map((r) => this.toDto(r));
  }
}