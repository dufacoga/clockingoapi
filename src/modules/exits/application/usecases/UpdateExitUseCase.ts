import { IExitRepository } from '../../domain/repositories/IExitRepository';
import { Exit } from '../../domain/entities/Exit';
import { UpdateExitDTO } from '../../interfaces/rest/schemas/ExitSchema';

const EDITABLE_FIELDS = [
  'ExitTime',
  'Result',
  'IrregularBehavior',
  'ReviewedByAdmin',
  'IsSynced',
  'DeviceId',
] as const;
type EditableField = typeof EDITABLE_FIELDS[number];

export default class UpdateExitUseCase {
  constructor(
    private deps: { exitRepo: IExitRepository & { update(id: number, patch: Partial<Exit>): Promise<Exit> } }
  ) {}

  private buildError(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
  }

  async execute(id: number, patch: UpdateExitDTO): Promise<Exit> {
    const { exitRepo } = this.deps;

    const exitEntity = await exitRepo.findById(id);
    if (!exitEntity) throw this.buildError('EXIT_NOT_FOUND', 404);
    if (exitEntity.IsDeleted) throw this.buildError('EXIT_ALREADY_DELETED', 409);
    
    const cleaned: Partial<Pick<Exit, EditableField>> = {};
    for (const [k, v] of Object.entries(patch ?? {})) {
      if (v === undefined) continue;
      if ((EDITABLE_FIELDS as readonly string[]).includes(k)) {
        const key = k as EditableField;
        (cleaned as any)[key] = v as any;
      }
    }

    if (Object.keys(cleaned).length === 0) {
      return exitEntity;
    }

    try {
      const updated = await exitRepo.update(id, cleaned as Partial<Exit>);
      return updated;
    } catch {
      throw this.buildError('EXIT_UPDATE_FAILED', 500);
    }
  }
}