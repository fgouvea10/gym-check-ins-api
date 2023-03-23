import { Prisma, Gym } from '@prisma/client'
import { prisma } from '~/lib/prisma'
import { FindManyNearByParams, GymsRepository } from '../interfaces/gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id
      }
    })

    return gym
  }

  async sarchMany(query: string, page: number): Promise<Gym[]> {
    const amountOfRecordsPerPage = 20

    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query
        }
      },
      take: amountOfRecordsPerPage,
      skip: (page - 1) * amountOfRecordsPerPage
    })

    return gyms
  }

  async findManyNearBy({ latitude, longitude }: FindManyNearByParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }
}