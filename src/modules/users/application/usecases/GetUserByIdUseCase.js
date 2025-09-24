class GetUserByIdUseCase {
  constructor({ userRepo }) {
    this.userRepo = userRepo;
  }

  async execute(id) {
    const user = await this.userRepo.findById(id);
    if (!user || user.IsDeleted) {
      const e = new Error('USER_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    return user;
  }
}

module.exports = GetUserByIdUseCase;