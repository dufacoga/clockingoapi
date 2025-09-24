class UpdateExitUseCase {
  constructor({ exitRepo }) {
    this.exitRepo = exitRepo;
  }

  async execute(id, patch) {
    const exitEntity = await this.exitRepo.findById(id);
    if (!exitEntity) {
      const e = new Error('EXIT_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    
    if (exitEntity.IsDeleted) {
      const e = new Error('EXIT_ALREADY_DELETED');
      e.status = 409;
      throw e;
    }
    
    const cleaned = {};
    for (const [k, v] of Object.entries(patch || {})) {
      if (v === undefined) continue;
      if (['Id', 'UserId', 'LocationId', 'EntryId', 'IsDeleted'].includes(k)) continue;
      cleaned[k] = v;
    }

    if (Object.keys(cleaned).length === 0) return exitEntity;
    
    const ok = await this.exitRepo.updatePartial(id, cleaned);
    if (!ok) {
      const e = new Error('EXIT_UPDATE_FAILED');
      e.status = 500;
      throw e;
    }
    
    return await this.exitRepo.findById(id);
  }
}

module.exports = UpdateExitUseCase;