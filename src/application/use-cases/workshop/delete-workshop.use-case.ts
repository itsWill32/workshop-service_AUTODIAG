import { Injectable } from '@nestjs/common';
import { IWorkshopRepository } from '../../../domain/repositories';
import {
  WorkshopNotFoundException,
  WorkshopNotOwnedByUserException,
} from '../../../domain/exceptions';

@Injectable()
export class DeleteWorkshopUseCase {
  constructor(private readonly workshopRepository: IWorkshopRepository) {}

  async execute(workshopId: string, ownerId: string): Promise<void> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    if (workshop.getOwnerId() !== ownerId) {
      throw new WorkshopNotOwnedByUserException(workshopId, ownerId);
    }

    // Desactivar (soft delete)
    workshop.deactivate();
    await this.workshopRepository.save(workshop);
  }
}