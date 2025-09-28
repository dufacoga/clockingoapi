import ExitRepositoryMaria from '../../infrastructure/persistence/maria/ExitRepository';

import GetExitByIdUseCase from '../../application/usecases/GetExitByIdUseCase';
import GetExitByEntryIdUseCase from '../../application/usecases/GetExitByEntryIdUseCase';
import RegisterExitUseCase from '../../application/usecases/RegisterExitUseCase';
import UpdateExitUseCase from '../../application/usecases/UpdateExitUseCase';
import ListExitsUseCase from '../../application/usecases/ListExitsUseCase';
import SoftDeleteExitUseCase from '../../application/usecases/SoftDeleteExitUseCase';

import UserRepositoryMaria from '../../../users/infrastructure/persistence/maria/UserRepository';
import LocationRepositoryMaria from '../../../locations/infrastructure/persistence/maria/LocationRepository';
import EntryRepositoryMaria from '../../../entries/infrastructure/persistence/maria/EntryRepository';

import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { ILocationRepository } from '../../../locations/domain/repositories/ILocationRepository';
import { IEntryRepository } from '../../../entries/domain/repositories/IEntryRepository';

type Deps =
  | {
      userRepo: IUserRepository;
      locationRepo: ILocationRepository;
      entryRepo: IEntryRepository;
    }
  | undefined;
  
export default function buildExit(deps?: Deps) {
  const exitRepo = new ExitRepositoryMaria();
  const userRepo: IUserRepository =
    (deps as any)?.userRepo ?? new UserRepositoryMaria();
  const locationRepo: ILocationRepository =
    (deps as any)?.locationRepo ?? new LocationRepositoryMaria();
  const entryRepo: IEntryRepository =
    (deps as any)?.entryRepo ?? new EntryRepositoryMaria();

  const api = {
    listExits: new ListExitsUseCase({ exitRepo }),
    getExitById: new GetExitByIdUseCase({ exitRepo }),
    getExitByEntryId: new GetExitByEntryIdUseCase({ exitRepo }),
    registerExit: new RegisterExitUseCase({
      userRepo,
      locationRepo,
      entryRepo,
      exitRepo,
    }),
    updateExit: new UpdateExitUseCase({ exitRepo }),
    softDeleteExit: new SoftDeleteExitUseCase({ exitRepo }),
    exitRepo,
  };

  return api;
}

export type ExitUC = ReturnType<typeof buildExit>;