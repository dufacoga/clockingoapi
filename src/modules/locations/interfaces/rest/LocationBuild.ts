import LocationRepositoryMaria from '../../infrastructure/persistence/maria/LocationRepository';

import CreateLocationUseCase from '../../application/usecases/CreateLocationUseCase';
import GetLocationByIdUseCase from '../../application/usecases/GetLocationByIdUseCase';
import GetLocationByCodeUseCase from '../../application/usecases/GetLocationByCodeUseCase';
import UpdateLocationUseCase from '../../application/usecases/UpdateLocationUseCase';
import ListLocationsUseCase from '../../application/usecases/ListLocationsUseCase';
import SoftDeleteLocationUseCase from '../../application/usecases/SoftDeleteLocationUseCase';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';

export interface LocationUC {
  createLocation: CreateLocationUseCase;
  getLocationById: GetLocationByIdUseCase;
  getLocationByCode: GetLocationByCodeUseCase;
  updateLocation: UpdateLocationUseCase;
  listLocations: ListLocationsUseCase;
  softDeleteLocation: SoftDeleteLocationUseCase;
  locationRepo: LocationRepositoryMaria;
}

interface LocationBuildDeps {
  userRepo: IUserRepository;
}

export default function buildLocation({ userRepo }: LocationBuildDeps): LocationUC {
  const locationRepo = new LocationRepositoryMaria();

  return {
    createLocation: new CreateLocationUseCase({ locationRepo, userRepo }),
    getLocationById: new GetLocationByIdUseCase({ locationRepo }),
    getLocationByCode: new GetLocationByCodeUseCase({ locationRepo }),
    updateLocation: new UpdateLocationUseCase({ locationRepo }),
    listLocations: new ListLocationsUseCase({ locationRepo }),
    softDeleteLocation: new SoftDeleteLocationUseCase({ locationRepo }),
    locationRepo,
  };
}