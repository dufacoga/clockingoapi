import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export default class GetUserByIdUseCase {
  constructor(private deps: { userRepo: IUserRepository }) {}

  private err(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number): Promise<User> {
    const { userRepo } = this.deps;

    const user = await userRepo.findById(id);
    if (!user || user.IsDeleted) {
      throw this.err('USER_NOT_FOUND', 404);
    }

    return user;
  }
}