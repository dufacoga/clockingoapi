import { IExitRepository } from '../../domain/repositories/IExitRepository';
import { Exit } from '../../domain/entities/Exit';

export default class GetExitByEntryIdUseCase {
  constructor(private deps: { exitRepo: IExitRepository }) {}

  private err(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(entryId: number): Promise<Exit> {
    const exitEntity = await this.deps.exitRepo.findByEntryId(entryId);
    if (!exitEntity || exitEntity.IsDeleted) {
      throw this.err('EXIT_NOT_FOUND_FOR_ENTRY', 404);
    }
    return exitEntity;
  }
}