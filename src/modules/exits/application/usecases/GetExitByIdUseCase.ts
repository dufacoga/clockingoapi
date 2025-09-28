import { IExitRepository } from '../../domain/repositories/IExitRepository';
import { Exit } from '../../domain/entities/Exit';

export default class GetExitByIdUseCase {
  private exitRepo: IExitRepository;

  constructor({ exitRepo }: { exitRepo: IExitRepository }) {
    this.exitRepo = exitRepo;
  }

  async execute(id: number): Promise<Exit> {
    const exitEntity = await this.exitRepo.findById(id);

    if (!exitEntity || exitEntity.IsDeleted) {
      const e = new Error('EXIT_NOT_FOUND') as Error & { status?: number };
      e.status = 404;
      throw e;
    }

    return exitEntity;
  }
}