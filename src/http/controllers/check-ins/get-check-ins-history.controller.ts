import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeFetchUserCheckInsHistoryService } from '~/http/services/factories/make-fetch-in-user-history.service'

export async function checkInsHistory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const checkInsHistoryService = makeFetchUserCheckInsHistoryService()

  const { checkIns } = await checkInsHistoryService.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
