class GetEntryByIdUseCase {
  constructor({ entryRepo }) { this.entryRepo = entryRepo; }
  async execute(id) {
    const entry = await this.entryRepo.findById(id);
    if (!entry) {
      const e = new Error('ENTRY_NOT_FOUND'); e.status = 404; throw e;
    }
    return entry;
  }
}
module.exports = GetEntryByIdUseCase;