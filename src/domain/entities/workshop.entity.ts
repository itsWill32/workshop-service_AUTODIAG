// autodiag-workshop-service/src/domain/entities/workshop.entity.ts

export class Workshop {
  id: string;
  ownerId: string; // FK a Auth Service
  name: string;
  description?: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  averageRating: number;
  totalReviews: number;
  priceRange: 'LOW' | 'MEDIUM' | 'HIGH' | 'PREMIUM';
  specialties: string[];
  brands: string[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Workshop>) {
    Object.assign(this, partial);
  }
}