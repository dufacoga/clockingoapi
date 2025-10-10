import { ILocationRepository } from '../../domain/repositories/ILocationRepository';

export default class SoftDeleteLocationUseCase {
  constructor(private deps: { locationRepo: ILocationRepository }) {}

  private err(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number): Promise<void> {
    const { locationRepo } = this.deps;

    const loc = await locationRepo.findById(id);
    if (!loc) throw this.err('LOCATION_NOT_FOUND', 404);
    if (loc.IsDeleted) throw this.err('LOCATION_ALREADY_DELETED', 409);

    const ok = await locationRepo.softDelete(id);
    if (!ok) throw this.err('USER_NOT_FOUND', 404);
  }
}