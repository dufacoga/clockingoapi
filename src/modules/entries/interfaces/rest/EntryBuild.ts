import EntryRepositoryMaria from '../../infrastructure/persistence/maria/EntryRepository';

import GetEntryByIdUseCase from '../../application/usecases/GetEntryByIdUseCase';
import GetLastEntryByUserUseCase from '../../application/usecases/GetLastEntryByUserUseCase';
import RegisterEntryUseCase from '../../application/usecases/RegisterEntryUseCase';
import UpdateEntryUseCase from '../../application/usecases/UpdateEntryUseCase';
import ListEntriesUseCase from '../../application/usecases/ListEntriesUseCase';
import SoftDeleteEntryUseCase from '../../application/usecases/SoftDeleteEntryUseCase';

import { IExitRepository } from '../../../exits/domain/repositories/IExitRepository';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { ILocationRepository } from '../../../locations/domain/repositories/ILocationRepository';

interface EntryBuildDeps {
  userRepo: IUserRepository;
  locationRepo: ILocationRepository;
  exitRepo?: IExitRepository | null;
}

export interface EntryUC {
  listEntries: ListEntriesUseCase;
  getEntryById: GetEntryByIdUseCase;
  getLastEntryByUser: GetLastEntryByUserUseCase;
  registerEntry: RegisterEntryUseCase;
  updateEntry: UpdateEntryUseCase;
  softDeleteEntry: SoftDeleteEntryUseCase;
  entryRepo: EntryRepositoryMaria;
  setExitRepo: (exitRepository: IExitRepository) => void;
}

export default function buildEntry({ userRepo, locationRepo, exitRepo = null }: EntryBuildDeps): EntryUC {
  const entryRepo = new EntryRepositoryMaria();
  let currentExitRepo: IExitRepository | null = exitRepo;

  let getLastEntryByUser = new GetLastEntryByUserUseCase({ entryRepo, exitRepo: currentExitRepo });
  let registerEntry = new RegisterEntryUseCase({
    userRepo,
    locationRepo,
    entryRepo,
    exitRepo: currentExitRepo,
  });

  const api: EntryUC = {
    listEntries: new ListEntriesUseCase({ entryRepo }),
    getEntryById: new GetEntryByIdUseCase({ entryRepo }),
    getLastEntryByUser,
    registerEntry,
    updateEntry: new UpdateEntryUseCase({ entryRepo }),
    softDeleteEntry: new SoftDeleteEntryUseCase({ entryRepo }),
    entryRepo,
    setExitRepo(exitRepository: IExitRepository) {
      currentExitRepo = exitRepository;
      getLastEntryByUser = new GetLastEntryByUserUseCase({ entryRepo, exitRepo: currentExitRepo });
      registerEntry = new RegisterEntryUseCase({
        userRepo,
        locationRepo,
        entryRepo,
        exitRepo: currentExitRepo,
      });
      this.getLastEntryByUser = getLastEntryByUser;
      this.registerEntry = registerEntry;
    },
  };

  return api;
}