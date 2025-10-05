import { Entry } from '../../domain/entities/Entry';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { ILocationRepository } from '../../../locations/domain/repositories/ILocationRepository';
import { IEntryRepository } from '../../domain/repositories/IEntryRepository';
import { IExitRepository } from '../../../exits/domain/repositories/IExitRepository';

interface RegisterEntryDeps {
  userRepo: IUserRepository;
  locationRepo: ILocationRepository;
  entryRepo: IEntryRepository;
  exitRepo: IExitRepository | null;
}

interface RegisterEntryInput {
  userId: number;
  locationId?: number | null;
  locationCode?: string | null;
  entryTime?: Date;
  selfie?: Buffer | null;
  deviceId?: string | null;
}

export default class RegisterEntryUseCase {
  private userRepo: IUserRepository;
  private locationRepo: ILocationRepository;
  private entryRepo: IEntryRepository;
  private exitRepo: IExitRepository | null;

  constructor({ userRepo, locationRepo, entryRepo, exitRepo }: RegisterEntryDeps) {
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
    entryTime = new Date(),
    selfie = null,
    deviceId = null,
  }: RegisterEntryInput): Promise<Entry> {
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
    if (lastEntry) {
      if (!this.exitRepo) {
        throw this.buildError('EXIT_REPOSITORY_NOT_CONFIGURED', 500);
      }
      const relatedExit = await this.exitRepo.findByEntryId(lastEntry.Id!);
      if (!relatedExit) {
        throw this.buildError('OPEN_ENTRY_EXISTS', 409);
      }
    }
    
    const entry = new Entry({
      UserId: userId,
      LocationId: loc.Id!,
      EntryTime: entryTime,
      Selfie: selfie,
      IsSynced: false,
      DeviceId: deviceId,
    });

    return this.entryRepo.create(entry);
  }
}