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

    delete patch.EntryId;
    delete patch.UserId;
    delete patch.LocationId;
    delete patch.Id;

    const ok = await this.exitRepo.updatePartial(id, patch);
    if (!ok) {
      const e = new Error('EXIT_UPDATE_FAILED');
      e.status = 500;
      throw e;
    }

    return await this.exitRepo.findById(id);
  }
}

module.exports = UpdateExitUseCase;