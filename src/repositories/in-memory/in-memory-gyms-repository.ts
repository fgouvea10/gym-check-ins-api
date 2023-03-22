import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '~/utils/get-distance-between-coordinates'

import {
  FindManyNearByParams,
  GymsRepository,
} from '../interfaces/gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      createdAt: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((item) => item.id === id)

    return gym ?? null
  }

  async sarchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearBy(params: FindManyNearByParams): Promise<Gym[]> {
    const MAX_DISTANCE_IN_KM = 10

    return this.gyms.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      )

      return distance < MAX_DISTANCE_IN_KM
    })
  }
}
