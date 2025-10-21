import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export type UpdateUserTotpDTO = Partial<{
  TotpSecret: string | null;
  TwoFactorEnabled: boolean;
  RecoveryCodes: string | null;
}>;

export default class UpdateUserTotpUseCase {
  constructor(private deps: { userRepo: IUserRepository }) {}

  private err(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number, patch: UpdateUserTotpDTO): Promise<User> {
    const { userRepo } = this.deps;
    const user = await userRepo.findById(id);
    if (!user) throw this.err('USER_NOT_FOUND', 404);
    if (user.IsDeleted) throw this.err('USER_ALREADY_DELETED', 409);

    const cleaned: UpdateUserTotpDTO = {};
    if (patch.TotpSecret !== undefined) cleaned.TotpSecret = patch.TotpSecret ?? null;
    if (patch.TwoFactorEnabled !== undefined) cleaned.TwoFactorEnabled = patch.TwoFactorEnabled;
    if (patch.RecoveryCodes !== undefined) cleaned.RecoveryCodes = patch.RecoveryCodes ?? null;

    if (Object.keys(cleaned).length === 0) {
      return user;
    }

    try {
      const updated = await userRepo.update(id, cleaned as Partial<User>);
      return updated;
    } catch {
      throw this.err('USER_UPDATE_FAILED', 500);
    }
  }
}
