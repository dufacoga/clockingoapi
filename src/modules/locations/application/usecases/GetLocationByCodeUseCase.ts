import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { Location } from '../../domain/entities/Location';

export default class GetLocationByCodeUseCase {
  constructor(private deps: { locationRepo: ILocationRepository }) {}

  async execute(code: string): Promise<Location> {
    const loc = await this.deps.locationRepo.findByCode(code);
    if (!loc || loc.IsDeleted) {
      const e = new Error('LOCATION_NOT_FOUND') as Error & { status?: number };
      e.status = 404;
      throw e;
    }
    return loc;
  }
}