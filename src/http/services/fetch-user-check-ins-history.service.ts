import type { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '~/repositories/interfaces/check-ins-repository'

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string;
  page: number
}

interface FetchUserCheckInsHistoryServiceResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

    return {
      checkIns,
    }
  }
}
