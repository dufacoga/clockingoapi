import { IRoleRepository } from '../../domain/repositories/IRoleRepository';
import { Role } from '../../domain/entities/Role';

export default class GetRoleByIdUseCase {
  constructor(private deps: { roleRepo: IRoleRepository }) {}

  private err(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number): Promise<Role> {
    const role = await this.deps.roleRepo.findById(id);
    if (!role) throw this.err('ROLE_NOT_FOUND', 404);
    return role;
  }
}