import { Entry } from '../../domain/entities/Entry';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { ILocationRepository } from '../../../locations/domain/repositories/ILocationRepository';
import { IEntryRepository } from '../../domain/repositories/IEntryRepository';
import { IExitRepository } from '../../../exits/domain/repositories/IExitRepository';

interface RegisterEntryDeps {
  userRepo: IUserRepository;
  locationRepo: ILocationRepository;
  entryRepo: IEntryRepository;
  exitRepo: IExitRepository;
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
  private exitRepo: IExitRepository;

  constructor({ userRepo, locationRepo, entryRepo, exitRepo }: RegisterEntryDeps) {
    this.userRepo = userRepo;
    this.locationRepo = locationRepo;
    this.entryRepo = entryRepo;
    this.exitRepo = exitRepo;
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
    if (lastEntry) {
      const relatedExit = await this.exitRepo.findByEntryId(lastEntry.Id!);
      if (!relatedExit) {
        const e = new Error('OPEN_ENTRY_EXISTS') as Error & { status?: number };
        e.status = 409;
        throw e;
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