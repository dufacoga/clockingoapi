const LocationRepository = require('../../infrastructure/persistence/maria/LocationRepository');

const CreateLocationUseCase = require('../../application/usecases/CreateLocationUseCase');
const GetLocationUseCase = require('../../application/usecases/GetLocationUseCase');
const UpdateLocationUseCase = require('../../application/usecases/UpdateLocationUseCase');

module.exports = function build() {
  const locationRepo = new LocationRepository();

  return {
    getLocation: new GetLocationUseCase({ locationRepo }),
    createLocation: new CreateLocationUseCase({ locationRepo }),
    updateLocation: new UpdateLocationUseCase({ locationRepo }),
    locationRepo
  };
};