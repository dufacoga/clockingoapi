import { Exit } from '../../domain/entities/Exit';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { ILocationRepository } from '../../../locations/domain/repositories/ILocationRepository';
import { IEntryRepository } from '../../../entries/domain/repositories/IEntryRepository';
import { IExitRepository } from '../../domain/repositories/IExitRepository';

interface RegisterExitDeps {
  userRepo: IUserRepository;
  locationRepo: ILocationRepository;
  entryRepo: IEntryRepository;
  exitRepo: IExitRepository;
}

interface RegisterExitInput {
  userId: number;
  locationId?: number | null;
  locationCode?: string | null;
  exitTime?: Date;
  result?: string | null;
  irregularBehavior?: boolean;
  deviceId?: string | null;
}

export default class RegisterExitUseCase {
  private userRepo: IUserRepository;
  private locationRepo: ILocationRepository;
  private entryRepo: IEntryRepository;
  private exitRepo: IExitRepository;

  constructor({ userRepo, locationRepo, entryRepo, exitRepo }: RegisterExitDeps) {
    this.userRepo = userRepo;
    this.locationRepo = locationRepo;
    this.entryRepo = entryRepo;
    this.exitRepo = exitRepo;
  }

  private buildError(message: string, status: number) {
    const e = new Error(message) as Error & { status?: number };
    e.status = status;
    return e;
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
      throw this.buildError('USER_NOT_FOUND', 404);
    }

    let loc = null;
    if (locationId != null) loc = await this.locationRepo.findById(locationId);
    if (!loc && locationCode) loc = await this.locationRepo.findByCode(locationCode);
    if (!loc) {
      throw this.buildError('LOCATION_NOT_FOUND', 404);
    }

    const lastEntry = await this.entryRepo.findLastByUser(userId);
    if (!lastEntry) {
      throw this.buildError('NO_OPEN_ENTRY', 409);
    }

    const existingExit = await this.exitRepo.findByEntryId(lastEntry.Id!);
    if (existingExit) {
      throw this.buildError('EXIT_ALREADY_REGISTERED', 409);
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