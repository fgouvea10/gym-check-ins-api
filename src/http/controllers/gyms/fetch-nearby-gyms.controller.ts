import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeSearchGymsService } from '~/http/services/factories/make-search-gyms.service'
import { makeFetchNearbyGyms } from '~/http/services/factories/make-fetch-nearby-gyms.service'

export async function fetchNearbyGyms(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  const fetchNearbyGymsService = makeFetchNearbyGyms()

  const { gyms } = await fetchNearbyGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
