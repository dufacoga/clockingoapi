import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export default class SoftDeleteUserUseCase {
  constructor(private deps: { userRepo: IUserRepository & { update(id: number, patch: Partial<User>): Promise<User> } }) {}

  private buildError(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number): Promise<void> {
    const { userRepo } = this.deps;

    const user = await userRepo.findById(id);
    if (!user) throw this.buildError('USER_NOT_FOUND', 404);
    if (user.IsDeleted) throw this.buildError('USER_ALREADY_DELETED', 409);

    const ok = await userRepo.softDelete(id);
    if (!ok) throw this.buildError('USER_NOT_FOUND', 404);
  }
}