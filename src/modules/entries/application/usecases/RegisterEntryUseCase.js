const { Entry } = require('../../domain/entities/Entry');

class RegisterEntryUseCase {
  constructor({ userRepo, locationRepo, entryRepo, exitRepo }) {
    this.userRepo = userRepo;
    this.locationRepo = locationRepo;
    this.entryRepo = entryRepo;
    this.exitRepo = exitRepo;
  }

  async execute({ userId, locationId, locationCode, entryTime = new Date(), selfie = null, deviceId = null }) {
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
    if (lastEntry) {
      const relatedExit = await this.exitRepo.findByEntryId(lastEntry.Id);
      if (!relatedExit) {
        const e = new Error('OPEN_ENTRY_EXISTS');
        e.status = 409;
        throw e;
      }
    }
    
    const entry = new Entry({
      UserId: userId,
      LocationId: loc.Id,
      EntryTime: entryTime,
      Selfie: selfie,
      IsSynced: false,
      DeviceId: deviceId,
    });

    const created = await this.entryRepo.create(entry);
    return created;
  }
}

module.exports = RegisterEntryUseCase;