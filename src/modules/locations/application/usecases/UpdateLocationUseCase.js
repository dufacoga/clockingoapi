class UpdateLocationUseCase {
  constructor({ locationRepo }) {
    this.locationRepo = locationRepo;
  }

  async execute(id, patch) {
    const loc = await this.locationRepo.findById(id);
    if (!loc) {
      const e = new Error('LOCATION_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    
    if (loc.IsDeleted) {
      const e = new Error('LOCATION_ALREADY_DELETED');
      e.status = 409;
      throw e;
    }
    
    if (patch.Code) {
      const exists = await this.locationRepo.findByCode(patch.Code);
      if (exists && exists.Id !== id) {
        const e = new Error('LOCATION_CODE_ALREADY_EXISTS');
        e.status = 409;
        throw e;
      }
    }
    
    const cleaned = {};
    for (const [k, v] of Object.entries(patch || {})) {
      if (v === undefined) continue;
      if (k === 'Id' || k === 'IsDeleted') continue;
      cleaned[k] = v;
    }

    if (Object.keys(cleaned).length === 0) return loc;
    
    const ok = await this.locationRepo.updatePartial(id, cleaned);
    if (!ok) {
      const e = new Error('LOCATION_UPDATE_FAILED');
      e.status = 500;
      throw e;
    }
    
    return await this.locationRepo.findById(id);
  }
}

module.exports = UpdateLocationUseCase;