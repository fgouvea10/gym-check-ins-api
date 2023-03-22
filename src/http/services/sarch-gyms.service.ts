import type { Gym } from '@prisma/client'

import { GymsRepository } from '~/repositories/interfaces/gyms-repository'

interface SearchGymsServiceRequest {
  query: string;
  page: number;
}

interface SearchGymsServiceResponse {
  gyms: Gym[];
}

export class SearchGymsService {
  constructor(private repository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsServiceRequest): Promise<SearchGymsServiceResponse> {
    const gyms = await this.repository.sarchMany(query, page)

    return {
      gyms,
    }
  }
}
