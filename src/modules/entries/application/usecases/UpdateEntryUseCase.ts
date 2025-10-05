import { IEntryRepository } from '../../domain/repositories/IEntryRepository';
import { Entry } from '../../domain/entities/Entry';
import { UpdateEntryDTO } from '../../interfaces/rest/schemas/EntrySchema';

interface UpdateEntryDeps {
  entryRepo: IEntryRepository & { update(id: number, patch: Partial<Entry>): Promise<Entry> };
}

export default class UpdateEntryUseCase {
  constructor(private deps: UpdateEntryDeps) {}

  private buildError(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number, patch: UpdateEntryDTO): Promise<Entry> {
    const { entryRepo } = this.deps;

    const entry = await entryRepo.findById(id);
    if (!entry) throw this.buildError('ENTRY_NOT_FOUND', 404);
    if (entry.IsDeleted) throw this.buildError('ENTRY_ALREADY_DELETED', 409);
    
    const cleaned: Partial<Entry> = {};

    if (patch.EntryTime !== undefined) {
      cleaned.EntryTime = patch.EntryTime ? new Date(patch.EntryTime) : null;
    }
    if (patch.Selfie !== undefined) {
      cleaned.Selfie = patch.Selfie ? Buffer.from(patch.Selfie, 'base64') : null;
    }
    if (patch.IsSynced !== undefined) {
      cleaned.IsSynced = patch.IsSynced;
    }
    if (patch.DeviceId !== undefined) {
      cleaned.DeviceId = patch.DeviceId ?? null;
    }

    if (Object.keys(cleaned).length === 0) return entry;

    try {
      const updated = await entryRepo.update(id, cleaned);
      return updated;
    } catch {
      throw this.buildError('ENTRY_UPDATE_FAILED', 500);
    }
  }
}