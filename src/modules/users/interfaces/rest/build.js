const UserRepository = require('../../infrastructure/persistence/maria/UserRepository');
const RoleRepository = require('../../infrastructure/persistence/maria/RoleRepository');

const CreateUserUseCase = require('../../application/usecases/CreateUserUseCase');
const GetUserByIdUseCase = require('../../application/usecases/GetUserByIdUseCase');
const GetUserByUsernameUseCase = require('../../application/usecases/GetUserByUsernameUseCase');
const UpdateUserUseCase = require('../../application/usecases/UpdateUserUseCase');

module.exports = function build() {
  const userRepo = new UserRepository();
  const roleRepo = new RoleRepository();

  return {
    getUserById: new GetUserByIdUseCase({ userRepo }),
    getUserByUsername: new GetUserByUsernameUseCase({ userRepo }),
    createUser: new CreateUserUseCase({ userRepo, roleRepo }),
    updateUser: new UpdateUserUseCase({ userRepo }),
    userRepo, roleRepo
  };
};