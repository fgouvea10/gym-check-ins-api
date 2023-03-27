import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '~/app'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'
import { prisma } from '~/lib/prisma'

describe('Check-in History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym 01',
        latitude: -22.8418808,
        longitude: -43.3404514,
      }
    })

    const checkIns = await prisma.checkIn.createMany({
      data: [
        {
          gymId: gym.id,
          userId: user.id,
        },
        {
          gymId: gym.id,
          userId: user.id,
        }
      ]
    })

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gymId: gym.id,
        userId: user.id,
      }),
      expect.objectContaining({
        gymId: gym.id,
        userId: user.id,
      })
    ])
  })
})
