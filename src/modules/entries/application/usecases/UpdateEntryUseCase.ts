import { IEntryRepository } from '../../domain/repositories/IEntryRepository';
import { Entry } from '../../domain/entities/Entry';
import { UpdateEntryDTO } from '../../interfaces/rest/schemas/EntrySchema';

const EDITABLE_FIELDS = ['EntryTime', 'Selfie', 'IsSynced', 'DeviceId'] as const;
type EditableField = typeof EDITABLE_FIELDS[number];

export default class UpdateEntryUseCase {
  constructor(
    private deps: { entryRepo: IEntryRepository & { update(id: number, patch: Partial<Entry>): Promise<Entry> } }
  ) {}

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
    
    const cleaned: Partial<Pick<Entry, EditableField>> = {};

    for (const [k, v] of Object.entries(patch ?? {})) {
      if (v === undefined) continue;
      if ((EDITABLE_FIELDS as readonly string[]).includes(k)) {
        const key = k as EditableField;
        (cleaned as any)[key] = v as any;
      }
    }
    
    if (Object.keys(cleaned).length === 0) return entry;
    
    try {
      const updated = await entryRepo.update(id, cleaned as Partial<Entry>);
      return updated;
    } catch {
      throw this.buildError('ENTRY_UPDATE_FAILED', 500);
    }
  }
}