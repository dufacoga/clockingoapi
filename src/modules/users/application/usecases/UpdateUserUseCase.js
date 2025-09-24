class UpdateUserUseCase {
  constructor({ userRepo, roleRepo }) {
    this.userRepo = userRepo;
    this.roleRepo = roleRepo;
  }

  async execute(id, patch) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      const e = new Error('USER_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    
    if (patch.Username) {
      const exists = await this.userRepo.findByUsername(patch.Username);
      if (exists && exists.Id !== id) {
        const e = new Error('USERNAME_ALREADY_EXISTS');
        e.status = 409;
        throw e;
      }
    }
    
    if (patch.RoleId) {
      const role = await this.roleRepo.findById(patch.RoleId);
      if (!role) {
        const e = new Error('ROLE_NOT_FOUND');
        e.status = 404;
        throw e;
      }
    }

    const ok = await this.userRepo.updatePartial(id, patch);
    if (!ok) {
      const e = new Error('USER_UPDATE_FAILED');
      e.status = 500;
      throw e;
    }

    return await this.userRepo.findById(id);
  }
}

module.exports = UpdateUserUseCase;