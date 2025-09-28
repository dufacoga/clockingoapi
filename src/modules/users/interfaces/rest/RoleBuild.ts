import RoleRepositoryMaria from '../../infrastructure/persistence/maria/RoleRepository';
import GetRoleByIdUseCase from '../../application/usecases/GetRoleByIdUseCase';
import ListRolesUseCase from '../../application/usecases/ListRolesUseCase';

export default function buildRole() {
  const roleRepo = new RoleRepositoryMaria();

  return {
    getRoleById: new GetRoleByIdUseCase({ roleRepo }),
    listRoles: new ListRolesUseCase({ roleRepo }),
    roleRepo,
  };
}

export type RoleUC = ReturnType<typeof buildRole>;