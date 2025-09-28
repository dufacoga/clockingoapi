import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { Location } from '../../domain/entities/Location';

export default class GetLocationByIdUseCase {
  constructor(private deps: { locationRepo: ILocationRepository }) {}

  async execute(id: number): Promise<Location> {
    const loc = await this.deps.locationRepo.findById(id);
    if (!loc || loc.IsDeleted) {
      const e = new Error('LOCATION_NOT_FOUND') as Error & { status?: number };
      e.status = 404;
      throw e;
    }
    return loc;
  }
}