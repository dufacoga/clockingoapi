import LocationRepositoryMaria from '../../infrastructure/persistence/maria/LocationRepository';

import CreateLocationUseCase from '../../application/usecases/CreateLocationUseCase';
import GetLocationByIdUseCase from '../../application/usecases/GetLocationByIdUseCase';
import GetLocationByCodeUseCase from '../../application/usecases/GetLocationByCodeUseCase';
import UpdateLocationUseCase from '../../application/usecases/UpdateLocationUseCase';
import ListLocationsUseCase from '../../application/usecases/ListLocationsUseCase';
import SoftDeleteLocationUseCase from '../../application/usecases/SoftDeleteLocationUseCase';

export default function buildLocation() {
  const locationRepo = new LocationRepositoryMaria();

  return {
    createLocation: new CreateLocationUseCase({ locationRepo, userRepo: null as any }),
    getLocationById: new GetLocationByIdUseCase({ locationRepo }),
    getLocationByCode: new GetLocationByCodeUseCase({ locationRepo }),
    updateLocation: new UpdateLocationUseCase({ locationRepo }),
    listLocations: new ListLocationsUseCase({ locationRepo }),
    softDeleteLocation: new SoftDeleteLocationUseCase({ locationRepo }),
    locationRepo,
    setUserRepo(userRepo: any) {
      (this as any).createLocation = new CreateLocationUseCase({ locationRepo, userRepo });
    }
  };
}

export type LocationUC = ReturnType<typeof buildLocation>;