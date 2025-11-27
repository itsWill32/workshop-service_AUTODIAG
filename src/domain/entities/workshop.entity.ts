import {
  BusinessInfo,
  Location,
  Coordinates,
  PriceRange,
} from '../value-objects';
import {
  InvalidPhoneException,
  InvalidEmailException,
  WorkshopAlreadyApprovedException,
  WorkshopAlreadyRejectedException,
  WorkshopInactiveException,
} from '../exceptions/workshop.exceptions';


export class Workshop {
  private constructor(
    private readonly id: string,
    private readonly ownerId: string,
    private businessInfo: BusinessInfo,
    private location: Location,
    private coordinates: Coordinates,
    private phone: string,
    private email: string | null,
    private website: string | null,
    private priceRange: PriceRange,
    private overallRating: number,
    private totalReviews: number,
    private photoUrls: string[],
    private isApproved: boolean,
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}


  static create(
    id: string,
    ownerId: string,
    businessInfo: BusinessInfo,
    location: Location,
    coordinates: Coordinates,
    phone: string,
    email: string | null,
    priceRange: PriceRange,
  ): Workshop {
    Workshop.validatePhone(phone);
    
    if (email) {
      Workshop.validateEmail(email);
    }

    const now = new Date();

    return new Workshop(
      id,
      ownerId,
      businessInfo,
      location,
      coordinates,
      phone,
      email,
      null,
      priceRange,
      0, 
      0, 
      [], 
      false, 
      true, 
      now,
      now,
    );
  }

  static fromPrimitives(
    id: string,
    ownerId: string,
    businessName: string,
    description: string | null,
    phone: string,
    email: string | null,
    website: string | null,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    latitude: number,
    longitude: number,
    priceRange: string,
    overallRating: number,
    totalReviews: number,
    photoUrls: string[],
    isApproved: boolean,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Workshop {
    return new Workshop(
      id,
      ownerId,
      BusinessInfo.create(businessName, description || undefined),
      Location.create(street, city, state, zipCode, country),
      Coordinates.create(latitude, longitude),
      phone,
      email,
      website,
      PriceRange.create(priceRange),
      overallRating,
      totalReviews,
      photoUrls,
      isApproved,
      isActive,
      createdAt,
      updatedAt,
    );
  }



  private static validatePhone(phone: string): void {
    if (!phone || phone.trim().length === 0) {
      throw new InvalidPhoneException('El teléfono no puede estar vacío');
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      throw new InvalidPhoneException('El teléfono debe tener al menos 10 dígitos');
    }

    if (digitsOnly.length > 15) {
      throw new InvalidPhoneException('El teléfono no puede exceder los 15 dígitos');
    }
  }

  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      throw new InvalidEmailException('Formato de email inválido');
    }
  }


  updateInfo(
    businessInfo?: BusinessInfo,
    phone?: string,
    email?: string | null,
    website?: string | null,
  ): void {
    if (businessInfo) {
      this.businessInfo = businessInfo;
    }

    if (phone) {
      Workshop.validatePhone(phone);
      this.phone = phone;
    }

    if (email !== undefined) {
      if (email) {
        Workshop.validateEmail(email);
      }
      this.email = email;
    }

    if (website !== undefined) {
      this.website = website;
    }

    this.updatedAt = new Date();
  }

  updateLocation(location: Location, coordinates: Coordinates): void {
    this.location = location;
    this.coordinates = coordinates;
    this.updatedAt = new Date();
  }


  updatePriceRange(priceRange: PriceRange): void {
    this.priceRange = priceRange;
    this.updatedAt = new Date();
  }


  addPhoto(photoUrl: string): void {
    if (this.photoUrls.length >= 10) {
      throw new Error('No puedes agregar más de 10 fotos');
    }

    if (this.photoUrls.includes(photoUrl)) {
      return; 
    }

    this.photoUrls.push(photoUrl);
    this.updatedAt = new Date();
  }

 
  removePhoto(photoUrl: string): void {
    this.photoUrls = this.photoUrls.filter((url) => url !== photoUrl);
    this.updatedAt = new Date();
  }


  approve(): void {
    if (this.isApproved) {
      throw new WorkshopAlreadyApprovedException(this.id);
    }

    this.isApproved = true;
    this.updatedAt = new Date();
  }

  reject(): void {
    if (!this.isApproved) {
      throw new WorkshopAlreadyRejectedException(this.id);
    }

    this.isApproved = false;
    this.updatedAt = new Date();
  }


  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }


  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }


  updateRating(newRating: number): void {
    const totalRatingPoints = this.overallRating * this.totalReviews;
    this.totalReviews += 1;
    this.overallRating = (totalRatingPoints + newRating) / this.totalReviews;
    this.updatedAt = new Date();
  }


  recalculateRating(removedRating: number): void {
    if (this.totalReviews <= 1) {
      this.overallRating = 0;
      this.totalReviews = 0;
    } else {
      const totalRatingPoints = this.overallRating * this.totalReviews;
      this.totalReviews -= 1;
      this.overallRating = (totalRatingPoints - removedRating) / this.totalReviews;
    }
    this.updatedAt = new Date();
  }


  isAvailableForAppointments(): boolean {
    return this.isApproved && this.isActive;
  }


  isNearby(coordinates: Coordinates, radiusKm: number): boolean {
    const distance = this.coordinates.distanceTo(coordinates);
    return distance <= radiusKm;
  }



  getId(): string {
    return this.id;
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getBusinessName(): string {
    return this.businessInfo.getBusinessName();
  }

  getDescription(): string | null {
    return this.businessInfo.getDescription();
  }

  getPhone(): string {
    return this.phone;
  }

  getEmail(): string | null {
    return this.email;
  }

  getWebsite(): string | null {
    return this.website;
  }

  getStreet(): string {
    return this.location.getStreet();
  }

  getCity(): string {
    return this.location.getCity();
  }

  getState(): string {
    return this.location.getState();
  }

  getZipCode(): string {
    return this.location.getZipCode();
  }

  getCountry(): string {
    return this.location.getCountry();
  }

  getFullAddress(): string {
    return this.location.getFullAddress();
  }

  getLatitude(): number {
    return this.coordinates.getLatitude();
  }

  getLongitude(): number {
    return this.coordinates.getLongitude();
  }

  getPriceRange(): string {
    return this.priceRange.getValue();
  }

  getOverallRating(): number {
    return this.overallRating;
  }

  getTotalReviews(): number {
    return this.totalReviews;
  }

  getPhotoUrls(): string[] {
    return [...this.photoUrls];
  }

  getIsApproved(): boolean {
    return this.isApproved;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}