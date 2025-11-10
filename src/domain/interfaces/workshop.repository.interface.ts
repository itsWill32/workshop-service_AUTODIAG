// autodiag-workshop-service/src/domain/interfaces/workshop.repository.interface.ts

import { Workshop } from '../entities/workshop.entity';

export const WORKSHOP_REPOSITORY = 'WorkshopRepository';

// Interfaz para filtros de búsqueda
export interface WorkshopQueryFilters {
  specialty?: string;
  priceRange?: 'LOW' | 'MEDIUM' | 'HIGH' | 'PREMIUM';
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface IWorkshopRepository {
  create(workshop: Workshop): Promise<Workshop>;
  findById(id: string): Promise<Workshop | null>;
  findAll(filters: WorkshopQueryFilters): Promise<Workshop[]>;
  
  // Para la búsqueda geoespacial
  findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number,
    filters: WorkshopQueryFilters,
  ): Promise<Workshop[]>;
  
  update(id: string, workshop: Partial<Workshop>): Promise<Workshop>;
  delete(id: string): Promise<void>;
}