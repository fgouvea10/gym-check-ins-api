import type { Gym } from '@prisma/client'

import { GymsRepository } from '~/repositories/interfaces/gyms-repository'

interface FetchNearByGymsServiceRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearByGymsServiceResponse {
  gyms: Gym[];
}

export class FetchNearByGymsService {
  constructor(private repository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearByGymsServiceRequest): Promise<FetchNearByGymsServiceResponse> {
    const gyms = await this.repository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude
    })

    return {
      gyms,
    }
  }
}
