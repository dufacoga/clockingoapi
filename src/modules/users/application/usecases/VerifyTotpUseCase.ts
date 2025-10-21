import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { authenticator } from 'otplib';

interface Input {
  userId: number;
  code: unknown;
}

export default class VerifyTotpUseCase {
  constructor(private deps: { userRepo: IUserRepository }) {}

  async execute({ userId, code }: Input): Promise<boolean> {
    if (typeof code !== 'string' || code.trim().length < 6) return false;

    const user = await this.deps.userRepo.findById(userId);
    if (!user?.TotpSecret) return false;
    
    const ok: boolean = authenticator.verify({
      token: code.trim(),
      secret: user.TotpSecret,
    });

    return ok;
  }
}
