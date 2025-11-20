import { Rating, Comment } from '../value-objects';
import {
  ReviewAlreadyRespondedException,
  InvalidSentimentException,
} from '../exceptions/review.exceptions';


export class Review {
  private constructor(
    private readonly id: string,
    private readonly workshopId: string,
    private readonly userId: string,
    private readonly userName: string,
    private readonly userAvatar: string | null,
    private readonly appointmentId: string | null,
    private overallRating: Rating,
    private qualityRating: Rating | null,
    private priceRating: Rating | null,
    private timeComplianceRating: Rating | null,
    private customerServiceRating: Rating | null,
    private comment: Comment | null,
    private sentimentLabel: string | null,
    private sentimentScore: number | null,
    private workshopResponse: string | null,
    private respondedAt: Date | null,
    private readonly isVerified: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}



  static create(
    id: string,
    workshopId: string,
    userId: string,
    userName: string,
    userAvatar: string | null,
    appointmentId: string | null,
    overallRating: Rating,
    qualityRating: Rating | null,
    priceRating: Rating | null,
    timeComplianceRating: Rating | null,
    customerServiceRating: Rating | null,
    comment: Comment | null,
  ): Review {
    const now = new Date();
    const isVerified = appointmentId !== null;

    return new Review(
      id,
      workshopId,
      userId,
      userName,
      userAvatar,
      appointmentId,
      overallRating,
      qualityRating,
      priceRating,
      timeComplianceRating,
      customerServiceRating,
      comment,
      null, 
      null, 
      null, 
      null, 
      isVerified,
      now,
      now,
    );
  }

  static fromPrimitives(
    id: string,
    workshopId: string,
    userId: string,
    userName: string,
    userAvatar: string | null,
    appointmentId: string | null,
    overallRating: number,
    qualityRating: number | null,
    priceRating: number | null,
    timeComplianceRating: number | null,
    customerServiceRating: number | null,
    comment: string | null,
    sentimentLabel: string | null,
    sentimentScore: number | null,
    workshopResponse: string | null,
    respondedAt: Date | null,
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Review {
    return new Review(
      id,
      workshopId,
      userId,
      userName,
      userAvatar,
      appointmentId,
      Rating.create(overallRating),
      qualityRating ? Rating.create(qualityRating) : null,
      priceRating ? Rating.create(priceRating) : null,
      timeComplianceRating ? Rating.create(timeComplianceRating) : null,
      customerServiceRating ? Rating.create(customerServiceRating) : null,
      comment ? Comment.create(comment) : null,
      sentimentLabel,
      sentimentScore,
      workshopResponse,
      respondedAt,
      isVerified,
      createdAt,
      updatedAt,
    );
  }

  update(
    overallRating?: Rating,
    qualityRating?: Rating | null,
    priceRating?: Rating | null,
    timeComplianceRating?: Rating | null,
    customerServiceRating?: Rating | null,
    comment?: Comment | null,
  ): void {
    if (overallRating) {
      this.overallRating = overallRating;
    }

    if (qualityRating !== undefined) {
      this.qualityRating = qualityRating;
    }

    if (priceRating !== undefined) {
      this.priceRating = priceRating;
    }

    if (timeComplianceRating !== undefined) {
      this.timeComplianceRating = timeComplianceRating;
    }

    if (customerServiceRating !== undefined) {
      this.customerServiceRating = customerServiceRating;
    }

    if (comment !== undefined) {
      this.comment = comment;
      this.sentimentLabel = null;
      this.sentimentScore = null;
    }

    this.updatedAt = new Date();
  }


  setSentiment(label: string, score: number): void {
    Review.validateSentiment(label, score);
    this.sentimentLabel = label;
    this.sentimentScore = score;
    this.updatedAt = new Date();
  }

  private static validateSentiment(label: string, score: number): void {
    const validLabels = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];
    if (!validLabels.includes(label)) {
      throw new InvalidSentimentException(
        `Invalido: ${label}. Tiene que ser POSITIVE, NEUTRAL, or NEGATIVE`,
      );
    }

    if (score < 0 || score > 1) {
      throw new InvalidSentimentException(
        `Invalido: ${score}. Tiene que estar entre 0 y 1`,
      );
    }
  }


  addWorkshopResponse(response: string): void {
    if (this.workshopResponse !== null) {
      throw new ReviewAlreadyRespondedException(this.id);
    }

    if (!response || response.trim().length === 0) {
      throw new Error('La respuesta del taller no puede estar vacía');
    }

    if (response.length > 1000) {
      throw new Error('La respuesta del taller no puede exceder los 1000 caracteres');
    }

    this.workshopResponse = response.trim();
    this.respondedAt = new Date();
    this.updatedAt = new Date();
  }


  hasWorkshopResponse(): boolean {
    return this.workshopResponse !== null;
  }



  getId(): string {
    return this.id;
  }

  getWorkshopId(): string {
    return this.workshopId;
  }

  getUserId(): string {
    return this.userId;
  }

  getUserName(): string {
    return this.userName;
  }

  getUserAvatar(): string | null {
    return this.userAvatar;
  }

  getAppointmentId(): string | null {
    return this.appointmentId;
  }

  getOverallRating(): number {
    return this.overallRating.getValue();
  }

  getQualityRating(): number | null {
    return this.qualityRating ? this.qualityRating.getValue() : null;
  }

  getPriceRating(): number | null {
    return this.priceRating ? this.priceRating.getValue() : null;
  }

  getTimeComplianceRating(): number | null {
    return this.timeComplianceRating ? this.timeComplianceRating.getValue() : null;
  }

  getCustomerServiceRating(): number | null {
    return this.customerServiceRating ? this.customerServiceRating.getValue() : null;
  }

  getComment(): string | null {
    return this.comment ? this.comment.getValue() : null;
  }

  getSentimentLabel(): string | null {
    return this.sentimentLabel;
  }

  getSentimentScore(): number | null {
    return this.sentimentScore;
  }

  getWorkshopResponse(): string | null {
    return this.workshopResponse;
  }

  getRespondedAt(): Date | null {
    return this.respondedAt;
  }

  getIsVerified(): boolean {
    return this.isVerified;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}