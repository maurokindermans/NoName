import { prisma } from '../prisma/prisma-client'

const timeslotsModel = {
  async findAllByDate(date: Date) {
    const nextDay = new Date()
    nextDay.setHours(0, 0, 0, 0)
    nextDay.setDate(date.getDate() + 1)

    return prisma.timeSlot.findMany({
      where: { startTime: { gte: date, lt: nextDay } },
    })
  },
  async findAvailableByDate(date: Date) {
    const nextDay = new Date()
    nextDay.setHours(0, 0, 0, 0)
    nextDay.setDate(date.getDate() + 1)
    return prisma.timeSlot.findMany({
      where: { clientId: null, startTime: { gte: date, lt: nextDay } },
    })
  },
  async create(timeSlot: any) {
    return prisma.timeSlot.create({ data: timeSlot })
  },
}

export default timeslotsModel
