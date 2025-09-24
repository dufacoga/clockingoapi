class GetLastEntryByUserUseCase {
  constructor({ entryRepo, exitRepo }) {
    this.entryRepo = entryRepo;
    this.exitRepo = exitRepo;
  }
  async execute(userId) {
    const lastEntry = await this.entryRepo.findLastByUser(userId);
    if (!lastEntry) return { entry: null, isOpen: false };

    const relatedExit = await this.exitRepo.findByEntryId(lastEntry.Id);
    return { entry: lastEntry, isOpen: !relatedExit };
  }
}
module.exports = GetLastEntryByUserUseCase;