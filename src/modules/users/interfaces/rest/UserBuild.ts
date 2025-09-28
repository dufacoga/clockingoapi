import UserRepositoryMaria from '../../infrastructure/persistence/maria/UserRepository';
import RoleRepositoryMaria from '../../infrastructure/persistence/maria/RoleRepository';

import CreateUserUseCase from '../../application/usecases/CreateUserUseCase';
import GetUserByIdUseCase from '../../application/usecases/GetUserByIdUseCase';
import GetUserByUsernameUseCase from '../../application/usecases/GetUserByUsernameUseCase';
import UpdateUserUseCase from '../../application/usecases/UpdateUserUseCase';
import ListUsersUseCase from '../../application/usecases/ListUsersUseCase';
import SoftDeleteUserUseCase from '../../application/usecases/SoftDeleteUserUseCase';

import GetRoleByIdUseCase from '../../application/usecases/GetRoleByIdUseCase';
import ListRolesUseCase from '../../application/usecases/ListRolesUseCase';

export default function buildUser() {
  const userRepo = new UserRepositoryMaria();
  const roleRepo = new RoleRepositoryMaria();

  return {
    listUsers: new ListUsersUseCase({ userRepo }),
    getUserById: new GetUserByIdUseCase({ userRepo }),
    getUserByUsername: new GetUserByUsernameUseCase({ userRepo }),
    createUser: new CreateUserUseCase({ userRepo, roleRepo }),
    updateUser: new UpdateUserUseCase({ userRepo, roleRepo }),
    softDeleteUser: new SoftDeleteUserUseCase({ userRepo }),
    userRepo,
  };
}

export type UserUC = ReturnType<typeof buildUser>;