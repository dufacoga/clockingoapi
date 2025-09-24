class GetLastEntryByUserUseCase {
  constructor({ entryRepo, exitRepo }) {
    this.entryRepo = entryRepo;
    this.exitRepo = exitRepo;
  }

  async execute(userId) {
    const lastEntry = await this.entryRepo.findLastByUser(userId);
    if (!lastEntry || lastEntry.IsDeleted) {
      return { entry: null, isOpen: false };
    }
    const relatedExit = await this.exitRepo.findByEntryId(lastEntry.Id);
    if (relatedExit && !relatedExit.IsDeleted) {
      return { entry: lastEntry, isOpen: false };
    }
    return { entry: lastEntry, isOpen: true };
  }
}

module.exports = GetLastEntryByUserUseCase;