class GetUserByUsernameUseCase {
  constructor({ userRepo }) { this.userRepo = userRepo; }
  async execute(username) {
    const user = await this.userRepo.findByUsername(username);
    if (!user) {
      const e = new Error('USER_NOT_FOUND'); e.status = 404; throw e;
    }
    return user;
  }
}
module.exports = GetUserByUsernameUseCase;