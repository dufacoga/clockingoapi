import { IExitRepository } from '../../domain/repositories/IExitRepository';
import { Exit } from '../../domain/entities/Exit';
import { UpdateExitDTO } from '../../interfaces/rest/schemas/ExitSchema';

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
    
    const cleaned: Partial<Exit> = {};
    if (patch.Result !== undefined) {
      cleaned.Result = patch.Result ?? null;
    }
    if (patch.IrregularBehavior !== undefined) {
      cleaned.IrregularBehavior = patch.IrregularBehavior;
    }
    if (patch.ReviewedByAdmin !== undefined) {
      cleaned.ReviewedByAdmin = patch.ReviewedByAdmin;
    }
    if (patch.IsSynced !== undefined) {
      cleaned.IsSynced = patch.IsSynced;
    }
    if (patch.DeviceId !== undefined) {
      cleaned.DeviceId = patch.DeviceId ?? null;
    }
    if (patch.IsDeleted !== undefined) {
      cleaned.IsDeleted = patch.IsDeleted;
    }

    if (Object.keys(cleaned).length === 0) {
      return exitEntity;
    }

    try {
      const updated = await exitRepo.update(id, cleaned);
      return updated;
    } catch {
      throw this.buildError('EXIT_UPDATE_FAILED', 500);
    }
  }
}