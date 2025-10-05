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

interface ExitBuildDeps {
  userRepo?: IUserRepository;
  locationRepo?: ILocationRepository;
  entryRepo?: IEntryRepository;
}

export interface ExitUC {
  listExits: ListExitsUseCase;
  getExitById: GetExitByIdUseCase;
  getExitByEntryId: GetExitByEntryIdUseCase;
  registerExit: RegisterExitUseCase;
  updateExit: UpdateExitUseCase;
  softDeleteExit: SoftDeleteExitUseCase;
  exitRepo: ExitRepositoryMaria;
}

export default function buildExit(deps: ExitBuildDeps = {}): ExitUC {
  const exitRepo = new ExitRepositoryMaria();
  const userRepo: IUserRepository = deps.userRepo ?? new UserRepositoryMaria();
  const locationRepo: ILocationRepository = deps.locationRepo ?? new LocationRepositoryMaria();
  const entryRepo: IEntryRepository = deps.entryRepo ?? new EntryRepositoryMaria();

  return {
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
}