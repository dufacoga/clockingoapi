const { User } = require('../../domain/entities/User');

class CreateUserUseCase {
  constructor({ userRepo, roleRepo }) {
    this.userRepo = userRepo;
    this.roleRepo = roleRepo;
  }

  async execute({ name, phone = null, username, authToken, roleId }) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) {
      const e = new Error('ROLE_NOT_FOUND');
      e.status = 404;
      throw e;
    }
    
    const existing = await this.userRepo.findByUsername(username);
    if (existing) {
      const e = new Error('USERNAME_ALREADY_EXISTS');
      e.status = 409;
      throw e;
    }
    
    const user = new User({
      Name: name,
      Phone: phone,
      Username: username,
      AuthToken: authToken,
      RoleId: roleId,
    });

    const created = await this.userRepo.create(user);
    return created;
  }
}

module.exports = CreateUserUseCase;