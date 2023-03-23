import { Prisma, CheckIn } from '@prisma/client'
import dayjs from 'dayjs'
import { prisma } from '~/lib/prisma'
import { CheckInsRepository } from '../interfaces/check-ins-repository'


export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async save(data: CheckIn): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data
    })

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endtOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfTheDay.toDate(),
          lte: endtOfTheDay.toDate()
        }
      }
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const amountOfRecordsPerPage = 20
    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId
      },
      take: amountOfRecordsPerPage,
      skip: (page - 1) * amountOfRecordsPerPage // page = 1 then (1-1 = 0) * 20, starting from 0
    })

    return checkIns
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        userId
      }
    })

    return count
  }

  async findById(checkInId: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id: checkInId
      }
    })

    return checkIn
  }
}