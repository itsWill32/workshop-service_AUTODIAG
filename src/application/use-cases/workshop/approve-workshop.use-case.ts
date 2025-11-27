import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { IWorkshopRepository } from '../../../domain/repositories';
import { WorkshopNotFoundException } from '../../../domain/exceptions';

@Injectable()
export class ApproveWorkshopUseCase {
  constructor(
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
  ) {}

  async execute(workshopId: string, adminUserId: string): Promise<void> {
    const workshop = await this.workshopRepository.findById(workshopId);

    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    workshop.approve();

    await this.workshopRepository.save(workshop);
  }
}