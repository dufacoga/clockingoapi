import { IEntryRepository } from '../../domain/repositories/IEntryRepository';
import { Entry } from '../../domain/entities/Entry';

export default class GetEntryByIdUseCase {
  private entryRepo: IEntryRepository;

  constructor({ entryRepo }: { entryRepo: IEntryRepository }) {
    this.entryRepo = entryRepo;
  }

  async execute(id: number): Promise<Entry> {
    const entry = await this.entryRepo.findById(id);

    if (!entry || entry.IsDeleted) {
      const error = new Error('ENTRY_NOT_FOUND') as Error & { status?: number };
      error.status = 404;
      throw error;
    }

    return entry;
  }
}