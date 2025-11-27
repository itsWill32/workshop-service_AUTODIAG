import { Injectable, Inject } from '@nestjs/common';
import { IWorkshopRepository } from '../../../domain/repositories';
import { WorkshopNotFoundException } from '../../../domain/exceptions';

@Injectable()
export class RejectWorkshopUseCase {
  constructor(
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
  ) {}

  async execute(workshopId: string, adminUserId: string): Promise<void> {
    const workshop = await this.workshopRepository.findById(workshopId);

    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    workshop.reject();

    await this.workshopRepository.save(workshop);
  }
}