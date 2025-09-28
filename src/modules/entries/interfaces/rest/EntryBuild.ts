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

type Deps = {
  userRepo: IUserRepository;
  locationRepo: ILocationRepository;
  exitRepo?: IExitRepository | null;
};

export default function buildEntry({ userRepo, locationRepo, exitRepo = null }: Deps) {
  const entryRepo = new EntryRepositoryMaria();
  let getLastEntryByUser = new GetLastEntryByUserUseCase({ entryRepo, exitRepo });
  const api = {
    listEntries: new ListEntriesUseCase({ entryRepo }),
    getEntryById: new GetEntryByIdUseCase({ entryRepo }),
    getLastEntryByUser,    
    registerEntry: new RegisterEntryUseCase({ userRepo, locationRepo, entryRepo, exitRepo: exitRepo as any }),
    updateEntry: new UpdateEntryUseCase({ entryRepo }),
    softDeleteEntry: new SoftDeleteEntryUseCase({ entryRepo }),    
    entryRepo,    
    setExitRepo(newExitRepo: IExitRepository) {
      getLastEntryByUser = new GetLastEntryByUserUseCase({ entryRepo, exitRepo: newExitRepo });      
      (api as any).getLastEntryByUser = getLastEntryByUser;      
      (api as any).registerEntry = new RegisterEntryUseCase({
        userRepo,
        locationRepo,
        entryRepo,
        exitRepo: newExitRepo,
      });
    },
  };

  return api;
}

export type EntryUC = ReturnType<typeof buildEntry>;