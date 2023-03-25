import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeValidateCheckInService } from '~/http/services/factories/make-validate-check-in.service'

export async function validateCheckIn(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInService = makeValidateCheckInService()

  await validateCheckInService.execute({
    checkInId,
  })

  return reply.status(204).send()
}
