class UpdateEntryUseCase {
  constructor({ entryRepo }) {
    this.entryRepo = entryRepo;
  }

  async execute(id, patch) {
    const entry = await this.entryRepo.findById(id);
    if (!entry) {
      const e = new Error('ENTRY_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    
    if (entry.IsDeleted) {
      const e = new Error('ENTRY_ALREADY_DELETED');
      e.status = 409;
      throw e;
    }
    
    const cleaned = {};
    for (const [k, v] of Object.entries(patch || {})) {
      if (v === undefined) continue;
      if (['Id', 'UserId', 'LocationId', 'IsDeleted'].includes(k)) continue;
      cleaned[k] = v;
    }
    
    if (Object.keys(cleaned).length === 0) return entry;
    
    const ok = await this.entryRepo.updatePartial(id, cleaned);
    if (!ok) {
      const e = new Error('ENTRY_UPDATE_FAILED');
      e.status = 500;
      throw e;
    }
    
    return await this.entryRepo.findById(id);
  }
}

module.exports = UpdateEntryUseCase;