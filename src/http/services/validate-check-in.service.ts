import type { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '~/repositories/interfaces/check-ins-repository'
import { GymsRepository } from '~/repositories/interfaces/gyms-repository'
import { getDistanceBetweenCoordinates } from '~/utils/get-distance-between-coordinates'
import {
  ResourceNotExistsException,
  MaxNumberOfCheckInsException,
  MaxDistanceException,
} from './errors'

interface ValidateCheckInServiceRequest {
  checkInId: string
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) {}

  async execute({
    checkInId
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotExistsException()

    checkIn.validatedAt = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
