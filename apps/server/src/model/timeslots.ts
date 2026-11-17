import { prisma } from '../prisma/prisma-client'

const timeslotsModel = {
  async findAllByDate(date: Date) {
    const nextDay = new Date()
    nextDay.setHours(0, 0, 0, 0)
    nextDay.setDate(date.getDate() + 1)

    return prisma.timeSlot.findMany({
      where: { startTime: { gte: date, lt: nextDay } },
      include: { client: true },
      orderBy: {
        startTime: 'asc',
      },
    })
  },
  async create(timeSlot: any) {
    return prisma.timeSlot.create({ data: timeSlot })
  },
  async delete(id: number) {
    return prisma.timeSlot.delete({
      where: { id },
    })
  },
  async findById(id: number) {
    return prisma.timeSlot.findUnique({
      where: { id },
    })
  },
  async update(timeSlot: any) {
    const { clientId, id } = timeSlot
    return prisma.timeSlot.update({
      where: { id },
      data: { clientId },
    })
  },
  async findAllByClientid(clientId: number) {
    return prisma.timeSlot.findMany({
      where: { clientId },
      orderBy: {
        startTime: 'asc',
      },
    })
  },
}

export default timeslotsModel
