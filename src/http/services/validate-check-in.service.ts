import type { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

import { CheckInsRepository } from '~/repositories/interfaces/check-ins-repository'
import {
  ResourceNotExistsException,
  LateCheckInValidationException,
} from './errors'

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotExistsException()

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      'minutes'
    )
    const maxMinutesForCheckIn = 20

    if (distanceInMinutesFromCheckInCreation > maxMinutesForCheckIn)
      throw new LateCheckInValidationException()

    checkIn.validatedAt = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
