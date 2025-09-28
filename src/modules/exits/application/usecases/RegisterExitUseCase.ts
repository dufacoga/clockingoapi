import { Exit } from '../../domain/entities/Exit';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { ILocationRepository } from '../../../locations/domain/repositories/ILocationRepository';
import { IEntryRepository } from '../../../entries/domain/repositories/IEntryRepository';
import { IExitRepository } from '../../domain/repositories/IExitRepository';

type Deps = {
  userRepo: IUserRepository;
  locationRepo: ILocationRepository;
  entryRepo: IEntryRepository;
  exitRepo: IExitRepository;
};

type RegisterExitInput = {
  userId: number;
  locationId?: number | null;
  locationCode?: string | null;
  exitTime?: Date;
  result?: string | null;
  irregularBehavior?: boolean;
  deviceId?: string | null;
};

export default class RegisterExitUseCase {
  private userRepo: IUserRepository;
  private locationRepo: ILocationRepository;
  private entryRepo: IEntryRepository;
  private exitRepo: IExitRepository;

  constructor({ userRepo, locationRepo, entryRepo, exitRepo }: Deps) {
    this.userRepo = userRepo;
    this.locationRepo = locationRepo;
    this.entryRepo = entryRepo;
    this.exitRepo = exitRepo;
  }

  async execute({
    userId,
    locationId = null,
    locationCode = null,
    exitTime = new Date(),
    result = null,
    irregularBehavior = false,
    deviceId = null,
  }: RegisterExitInput): Promise<Exit> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      const e = new Error('USER_NOT_FOUND') as Error & { status?: number };
      e.status = 404;
      throw e;
    }

    let loc = null;
    if (locationId != null) loc = await this.locationRepo.findById(locationId);
    if (!loc && locationCode) loc = await this.locationRepo.findByCode(locationCode);
    if (!loc) {
      const e = new Error('LOCATION_NOT_FOUND') as Error & { status?: number };
      e.status = 404;
      throw e;
    }

    const lastEntry = await this.entryRepo.findLastByUser(userId);
    if (!lastEntry) {
      const e = new Error('NO_OPEN_ENTRY') as Error & { status?: number };
      e.status = 409;
      throw e;
    }

    const existingExit = await this.exitRepo.findByEntryId(lastEntry.Id!);
    if (existingExit) {
      const e = new Error('EXIT_ALREADY_REGISTERED') as Error & { status?: number };
      e.status = 409;
      throw e;
    }

    const markIrregular = irregularBehavior || lastEntry.LocationId !== loc.Id;

    const exitEntity = new Exit({
      UserId: userId,
      LocationId: loc.Id!,
      ExitTime: exitTime,
      EntryId: lastEntry.Id!,
      Result: result,
      IrregularBehavior: markIrregular,
      ReviewedByAdmin: false,
      IsSynced: false,
      DeviceId: deviceId,
    });

    return await this.exitRepo.create(exitEntity);
  }
}