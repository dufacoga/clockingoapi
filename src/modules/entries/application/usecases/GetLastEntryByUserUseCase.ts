import { IEntryRepository } from '../../domain/repositories/IEntryRepository';
import { IExitRepository } from '../../../exits/domain/repositories/IExitRepository';
import { Entry } from '../../domain/entities/Entry';

type Result = {
  entry: Entry | null;
  isOpen: boolean;
};

export default class GetLastEntryByUserUseCase {
  private entryRepo: IEntryRepository;
  private exitRepo: IExitRepository | null;

  constructor({ entryRepo, exitRepo }: { entryRepo: IEntryRepository; exitRepo: IExitRepository | null }) {
    this.entryRepo = entryRepo;
    this.exitRepo = exitRepo;
  }

  async execute(userId: number): Promise<Result> {
    const lastEntry = await this.entryRepo.findLastByUser(userId);
    
    if (!lastEntry || lastEntry.IsDeleted) {
      return { entry: null, isOpen: false };
    }
    
    if (!this.exitRepo) {
      return { entry: lastEntry, isOpen: true };
    }

    const relatedExit = await this.exitRepo.findByEntryId(lastEntry.Id!);
    
    if (relatedExit && !relatedExit.IsDeleted) {
      return { entry: lastEntry, isOpen: false };
    }
    return { entry: lastEntry, isOpen: true };
  }
}