const { Location } = require('../../domain/entities/Location');

class CreateLocationUseCase {
  constructor({ locationRepo, userRepo }) {
    this.locationRepo = locationRepo;
    this.userRepo = userRepo;
  }

  async execute({ code, address = null, city = null, createdBy, isCompanyOffice = false }) {
    const user = await this.userRepo.findById(createdBy);
    if (!user) {
      const e = new Error('CREATED_BY_USER_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    
    const existing = await this.locationRepo.findByCode(code);
    if (existing) {
      const e = new Error('LOCATION_CODE_ALREADY_EXISTS');
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

    const created = await this.locationRepo.create(location);
    return created;
  }
}

module.exports = CreateLocationUseCase;