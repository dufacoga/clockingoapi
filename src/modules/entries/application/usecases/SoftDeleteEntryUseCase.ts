import { IEntryRepository } from '../../domain/repositories/IEntryRepository';
import { Entry } from '../../domain/entities/Entry';

export default class SoftDeleteEntryUseCase {
  constructor(private deps: { entryRepo: IEntryRepository & { update(id: number, patch: Partial<Entry>): Promise<Entry> } }) {}

  private buildError(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number): Promise<void> {
    const { entryRepo } = this.deps;

    const entry = await entryRepo.findById(id);
    if (!entry) throw this.buildError('ENTRY_NOT_FOUND', 404);
    if (entry.IsDeleted) throw this.buildError('ENTRY_ALREADY_DELETED', 409);

    const ok = await entryRepo.softDelete(id);
    if (!ok) throw this.buildError('USER_NOT_FOUND', 404);
  }
}