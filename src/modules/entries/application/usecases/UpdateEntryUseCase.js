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
    
    delete patch.UserId;
    delete patch.LocationId;
    delete patch.Id;

    const ok = await this.entryRepo.updatePartial(id, patch);
    if (!ok) {
      const e = new Error('ENTRY_UPDATE_FAILED');
      e.status = 500;
      throw e;
    }

    return await this.entryRepo.findById(id);
  }
}

module.exports = UpdateEntryUseCase;