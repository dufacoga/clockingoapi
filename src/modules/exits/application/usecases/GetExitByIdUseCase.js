class GetExitByIdUseCase {
  constructor({ exitRepo }) {
    this.exitRepo = exitRepo;
  }

  async execute(id) {
    const exitEntity = await this.exitRepo.findById(id);
    if (!exitEntity || exitEntity.IsDeleted) {
      const e = new Error('EXIT_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    return exitEntity;
  }
}

module.exports = GetExitByIdUseCase;