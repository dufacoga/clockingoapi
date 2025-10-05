import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { Location } from '../../domain/entities/Location';

export type UpdateLocationDTO = Partial<{
  Code: string;
  Address: string | null;
  City: string | null;
  CreatedBy: number;
  IsCompanyOffice: boolean;
}>;

export default class UpdateLocationUseCase {
  private locationRepo: ILocationRepository;

  constructor({ locationRepo }: { locationRepo: ILocationRepository }) {
    this.locationRepo = locationRepo;
  }

  private buildError(message: string, status: number): Error & { status?: number } {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number, patch: UpdateLocationDTO): Promise<Location> {
    const loc = await this.locationRepo.findById(id);
    if (!loc) throw this.buildError('LOCATION_NOT_FOUND', 404);
    if (loc.IsDeleted) throw this.buildError('LOCATION_ALREADY_DELETED', 409);

    if (patch.Code) {
      const exists = await this.locationRepo.findByCode(patch.Code);
      if (exists && exists.Id !== id) {
        throw this.buildError('LOCATION_CODE_ALREADY_EXISTS', 409);
      }
    }

    const cleaned: UpdateLocationDTO = {};
    if (patch.Code !== undefined) cleaned.Code = patch.Code;
    if (patch.Address !== undefined) cleaned.Address = patch.Address ?? null;
    if (patch.City !== undefined) cleaned.City = patch.City ?? null;
    if (patch.CreatedBy !== undefined) cleaned.CreatedBy = patch.CreatedBy;
    if (patch.IsCompanyOffice !== undefined) cleaned.IsCompanyOffice = patch.IsCompanyOffice;

    if (Object.keys(cleaned).length === 0) {
      return loc;
    }

    await this.locationRepo.update(id, cleaned);
    const updated = await this.locationRepo.findById(id);
    if (!updated) throw this.buildError('LOCATION_UPDATE_FAILED', 500);

    return updated;
  }
}