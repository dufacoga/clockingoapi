const { Exit } = require('../../domain/entities/Exit');

class RegisterExitUseCase {
  constructor({ userRepo, locationRepo, entryRepo, exitRepo }) {
    this.userRepo = userRepo;
    this.locationRepo = locationRepo;
    this.entryRepo = entryRepo;
    this.exitRepo = exitRepo;
  }

  async execute({
    userId,
    locationId,
    locationCode,
    exitTime = new Date(),
    result = null,
    irregularBehavior = false,
    deviceId = null,
  }) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      const e = new Error('USER_NOT_FOUND');
      e.status = 404;
      throw e;
    }

    let loc = null;
    if (locationId != null) loc = await this.locationRepo.findById(locationId);
    if (!loc && locationCode) loc = await this.locationRepo.findByCode(locationCode);
    if (!loc) {
      const e = new Error('LOCATION_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    
    const lastEntry = await this.entryRepo.findLastByUser(userId);
    if (!lastEntry) {
      const e = new Error('NO_OPEN_ENTRY');
      e.status = 409;
      throw e;
    }
    
    const existingExit = await this.exitRepo.findByEntryId(lastEntry.Id);
    if (existingExit) {
      const e = new Error('EXIT_ALREADY_REGISTERED');
      e.status = 409;
      throw e;
    }
    
    const markIrregular = irregularBehavior || (lastEntry.LocationId !== loc.Id);
    
    const exitEntity = new Exit({
      UserId: userId,
      LocationId: loc.Id,
      ExitTime: exitTime,
      EntryId: lastEntry.Id,
      Result: result,
      IrregularBehavior: markIrregular,
      ReviewedByAdmin: false,
      IsSynced: false,
      DeviceId: deviceId,
    });

    const created = await this.exitRepo.create(exitEntity);
    return created;
  }
}

module.exports = RegisterExitUseCase;