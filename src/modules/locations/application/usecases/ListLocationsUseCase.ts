import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { Location } from '../../domain/entities/Location';

interface ListLocationsParams {
  page?: number;
  pageSize?: number;
}

export default class ListLocationsUseCase {
  constructor(private deps: { locationRepo: ILocationRepository }) {}

  async execute({ page = 1, pageSize = 50 }: ListLocationsParams): Promise<{
    items: Location[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { items, total } = await this.deps.locationRepo.listPage({ page, pageSize });
    return { items, total, page, pageSize };
  }
}