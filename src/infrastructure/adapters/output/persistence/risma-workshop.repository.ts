// autodiag-workshop-service/src/infrastructure/adapters/output/persistence/prisma-workshop.repository.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient, Workshop as PrismaWorkshop, PriceRange } from '@prisma/client';
import { Workshop } from '../../../../domain/entities/workshop.entity';
import { IWorkshopRepository, WorkshopQueryFilters } from '../../../../domain/interfaces/workshop.repository.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaWorkshopRepository implements IWorkshopRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Mapeador simple
  private toDomain(workshop: PrismaWorkshop): Workshop {
    return new Workshop(workshop);
  }

  async findById(id: string): Promise<Workshop | null> {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id, isActive: true, isVerified: true },
    });
    return workshop ? this.toDomain(workshop) : null;
  }

  async findAll(filters: WorkshopQueryFilters): Promise<Workshop[]> {
    const { specialty, minRating, priceRange, page = 1, limit = 20 } = filters;
    const where: Prisma.WorkshopWhereInput = {
      isActive: true,
      isVerified: true,
    };

    if (specialty) {
      where.specialties = { has: specialty };
    }
    if (minRating) {
      where.averageRating = { gte: minRating };
    }
    if (priceRange) {
      where.priceRange = { equals: priceRange as PriceRange };
    }

    const workshops = await this.prisma.workshop.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { averageRating: 'desc' },
    });
    return workshops.map(this.toDomain);
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number,
    filters: WorkshopQueryFilters,
  ): Promise<any[]> { // Devuelve 'any' porque Prisma añade el campo 'distance'
    
    const { specialty, minRating, priceRange, limit = 20 } = filters;
    const radiusMeters = radiusKm * 1000;

    // 1. Construir la cláusula 'WHERE' de los filtros
    let filterClauses = `WHERE w."isActive" = true AND w."isVerified" = true`;
    if (specialty) {
      filterClauses += ` AND '${specialty}' = ANY(w.specialties)`;
    }
    if (minRating) {
      filterClauses += ` AND w."averageRating" >= ${minRating}`;
    }
    if (priceRange) {
      filterClauses += ` AND w."priceRange" = '${priceRange}'`;
    }

    // 2. Construir la consulta PostGIS
    // Usamos $queryRawUnsafe para poder inyectar dinámicamente las cláusulas 'WHERE'
    // ¡Asegúrate de que los filtros (specialty, minRating) estén validados por el DTO!
    try {
      const workshops = await this.prisma.$queryRawUnsafe(`
        SELECT *, 
          ST_Distance(
            ST_MakePoint(longitude, latitude)::geography, 
            ST_MakePoint(${longitude}, ${latitude})::geography
          ) / 1000.0 as distance
        FROM "workshop"."Workshop" as w
        ${filterClauses}
        AND ST_DWithin(
          ST_MakePoint(longitude, latitude)::geography,
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ${radiusMeters}
        )
        ORDER BY distance
        LIMIT ${limit};
      `);
      return workshops as any[];
    } catch (e) {
      console.error("Error en consulta PostGIS:", e);
      throw new InternalServerErrorException("Error al buscar talleres cercanos");
    }
  }

  // Métodos no usados por el MVP (pero necesarios para el repositorio)
  async create(workshop: Workshop): Promise<Workshop> {
    // Implementar lógica de creación
    throw new Error('Method not implemented.');
  }
  async update(id: string, workshop: Partial<Workshop>): Promise<Workshop> {
    // Implementar lógica de actualización
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<void> {
    // Implementar lógica de borrado
    throw new Error('Method not implemented.');
  }
}