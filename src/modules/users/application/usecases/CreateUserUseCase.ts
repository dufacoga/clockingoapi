import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRoleRepository } from '../../domain/repositories/IRoleRepository';

interface CreateUserInput {
  name: string;
  phone?: string | null;
  username: string;
  authToken: string;
  roleId: number;
}

export default class CreateUserUseCase {
  constructor(private deps: { userRepo: IUserRepository; roleRepo: IRoleRepository }) {}

  private err(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute({
    name,
    phone = null,
    username,
    authToken,
    roleId,
  }: CreateUserInput): Promise<User> {
    const role = await this.deps.roleRepo.findById(roleId);
    if (!role) throw this.err('ROLE_NOT_FOUND', 404);
    
    const existing = await this.deps.userRepo.findByUsername(username);
    if (existing) throw this.err('USERNAME_ALREADY_EXISTS', 409);
    
    const user = new User({
      Name: name,
      Phone: phone,
      Username: username,
      AuthToken: authToken,
      RoleId: roleId,
    });
    
    return await this.deps.userRepo.create(user);
  }
}