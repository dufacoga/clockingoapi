import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRoleRepository } from '../../domain/repositories/IRoleRepository';
import { User } from '../../domain/entities/User';

export type UpdateUserDTO = Partial<{
  Name: string;
  Phone: string | null;
  Username: string;
  AuthToken: string;
  RoleId: number;
}>;

export default class UpdateUserUseCase {
  constructor(
    private deps: { userRepo: IUserRepository; roleRepo: IRoleRepository }
  ) {}

  private err(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number, patch: UpdateUserDTO): Promise<User> {
    const { userRepo, roleRepo } = this.deps;
    
    const user = await userRepo.findById(id);
    if (!user) throw this.err('USER_NOT_FOUND', 404);
    if (user.IsDeleted) throw this.err('USER_ALREADY_DELETED', 409);
    
    if (patch.Username) {
      const exists = await userRepo.findByUsername(patch.Username);
      if (exists && exists.Id !== id) {
        throw this.err('USERNAME_ALREADY_EXISTS', 409);
      }
    }
    
    if (patch.RoleId !== undefined) {
      const role = await roleRepo.findById(patch.RoleId);
      if (!role) throw this.err('ROLE_NOT_FOUND', 404);
    }
    
    const cleaned: UpdateUserDTO = {};
    if (patch.Name !== undefined) cleaned.Name = patch.Name;
    if (patch.Phone !== undefined) cleaned.Phone = patch.Phone ?? null;
    if (patch.Username !== undefined) cleaned.Username = patch.Username;
    if (patch.AuthToken !== undefined) cleaned.AuthToken = patch.AuthToken;
    if (patch.RoleId !== undefined) cleaned.RoleId = patch.RoleId;

    if (Object.keys(cleaned).length === 0) return user;

    try {
      const updated = await userRepo.update(id, cleaned);
      return updated;
    } catch {
      throw this.err('USER_UPDATE_FAILED', 500);
    }
  }
}