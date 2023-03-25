import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeGetUserMetricsService } from '~/http/services/factories/make-get-user-metrics.service'

export async function getMetrics(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getUserMetricsService = makeGetUserMetricsService()

  const { checkInsCount } = await getUserMetricsService.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
