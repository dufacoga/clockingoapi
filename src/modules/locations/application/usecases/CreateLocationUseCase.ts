import { Location } from '../../domain/entities/Location';
import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';

interface CreateLocationInput {
  code: string;
  address?: string | null;
  city?: string | null;
  createdBy: number;
  isCompanyOffice?: boolean;
}

export default class CreateLocationUseCase {
  private locationRepo: ILocationRepository;
  private userRepo: IUserRepository;

  constructor({ locationRepo, userRepo }: { locationRepo: ILocationRepository; userRepo: IUserRepository }) {
    this.locationRepo = locationRepo;
    this.userRepo = userRepo;
  }

  private buildError(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute({ code, address = null, city = null, createdBy, isCompanyOffice = false }: CreateLocationInput) {
    const user = await this.userRepo.findById(createdBy);
    if (!user) {
      throw this.buildError('CREATED_BY_USER_NOT_FOUND', 404);
    }

    const existing = await this.locationRepo.findByCode(code);
    if (existing) {
      throw this.buildError('LOCATION_CODE_ALREADY_EXISTS', 409);
    }
    
    const location = new Location({
      Code: code,
      Address: address,
      City: city,
      CreatedBy: createdBy,
      IsCompanyOffice: isCompanyOffice,
    });
    
    return await this.locationRepo.create(location);
  }
}