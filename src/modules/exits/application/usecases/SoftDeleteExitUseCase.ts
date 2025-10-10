import { IExitRepository } from '../../domain/repositories/IExitRepository';
import { Exit } from '../../domain/entities/Exit';

export default class SoftDeleteExitUseCase {
  constructor(
    private deps: { exitRepo: IExitRepository & { update(id: number, patch: Partial<Exit>): Promise<Exit> } }
  ) {}

  private err(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number): Promise<void> {
    const { exitRepo } = this.deps;

    const exitEntity = await exitRepo.findById(id);
    if (!exitEntity) throw this.err('EXIT_NOT_FOUND', 404);
    if (exitEntity.IsDeleted) throw this.err('EXIT_ALREADY_DELETED', 409);

    const ok = await exitRepo.softDelete(id);
    if (!ok) throw this.err('USER_NOT_FOUND', 404);
  }
}