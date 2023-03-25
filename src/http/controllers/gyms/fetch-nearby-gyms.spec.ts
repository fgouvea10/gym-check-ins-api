import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '~/app'
import { createAndAuthenticateUser } from '~/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym Example 01',
        description: 'Nice description for e2e testing',
        phone: '555000555',
        latitude: -22.8418808,
        longitude: -43.3404514,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym Example 02',
        description: 'Nice description for e2e testing',
        phone: '555000555',
        latitude: 12.9765381,
        longitude: -38.4815099,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ latitude: -22.8418808, longitude: -43.3404514 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym Example 01',
      }),
    ])
  })
})
