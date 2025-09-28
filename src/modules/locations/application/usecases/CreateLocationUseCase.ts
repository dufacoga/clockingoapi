import { Location } from '../../domain/entities/Location';
import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';

type CreateLocationInput = {
  code: string;
  address?: string | null;
  city?: string | null;
  createdBy: number;
  isCompanyOffice?: boolean;
};

export default class CreateLocationUseCase {
  private locationRepo: ILocationRepository;
  private userRepo: IUserRepository;

  constructor({ locationRepo, userRepo }: { locationRepo: ILocationRepository; userRepo: IUserRepository }) {
    this.locationRepo = locationRepo;
    this.userRepo = userRepo;
  }

  async execute({ code, address = null, city = null, createdBy, isCompanyOffice = false }: CreateLocationInput) {
    const user = await this.userRepo.findById(createdBy);
    if (!user) {
      const e: any = new Error('CREATED_BY_USER_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    
    const existing = await this.locationRepo.findByCode(code);
    if (existing) {
      const e: any = new Error('LOCATION_CODE_ALREADY_EXISTS');
      e.status = 409;
      throw e;
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