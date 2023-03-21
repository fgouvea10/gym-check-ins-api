import type { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '~/repositories/interfaces/check-ins-repository'
import { GymsRepository } from '~/repositories/interfaces/gyms-repository'
import { ResourceNotExistsException } from './errors'

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) throw new ResourceNotExistsException()

    // calculate distance between user and gym

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    if (checkInOnSameDay) throw new Error()

    const checkIn = await this.checkInsRepository.create({
      userId,
      gymId,
    })

    return {
      checkIn,
    }
  }
}
