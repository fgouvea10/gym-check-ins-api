import { Gym } from '@prisma/client'

import { GymsRepository } from '../interfaces/gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find(item => item.id === id)

    return gym ?? null
  }
}
