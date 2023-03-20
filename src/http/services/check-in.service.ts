import type { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '~/repositories/interfaces/check-ins-repository'

interface CheckInServiceRequest {
  userId: string
  gymId: string
}

interface CheckInServiceResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(private repository: CheckInsRepository) {}

  async execute({ userId, gymId }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const checkInOnSameDay = await this.repository.findByUserIdOnDate(userId, new Date())

    if (checkInOnSameDay) throw new Error()

    const checkIn = await this.repository.create({
      userId,
      gymId
    })

    return {
      checkIn
    }
  }
}
