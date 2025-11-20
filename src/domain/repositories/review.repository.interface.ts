import { Review } from '../entities';

export interface IReviewRepository {

  save(review: Review): Promise<Review>;

  findById(id: string): Promise<Review | null>;


  delete(id: string): Promise<void>;


  findByWorkshopId(
    workshopId: string,
    page: number,
    limit: number,
    sortBy?: ReviewSortBy,
  ): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  findByUserId(userId: string): Promise<Review[]>;

 
  findByAppointmentId(appointmentId: string): Promise<Review | null>;


  existsForAppointment(appointmentId: string): Promise<boolean>;


  countByWorkshopId(workshopId: string): Promise<number>;


  getReviewStatistics(workshopId: string): Promise<ReviewStatistics>;


  findPendingSentimentAnalysis(limit: number): Promise<Review[]>;
}


export enum ReviewSortBy {
  RECENT = 'recent',
  RATING_HIGH = 'rating_high',
  RATING_LOW = 'rating_low',
  HELPFUL = 'helpful',
}


export interface ReviewStatistics {
  totalReviews: number;
  averageOverall: number;
  averageQuality: number;
  averagePrice: number;
  averageTimeCompliance: number;
  averageCustomerService: number;
  ratingDistribution: {
    fiveStars: number;
    fourStars: number;
    threeStars: number;
    twoStars: number;
    oneStar: number;
  };
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}