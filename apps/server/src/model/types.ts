import { TimeSlotType } from '../prisma/generated/prisma/client'
import { prisma } from '../prisma/prisma-client'

const typesModel = {
  async findAll() {
    return prisma.timeSlotType.findMany()
  },
  async create(type: TimeSlotType) {
    return prisma.timeSlotType.create({ data: type })
  },
  async findByName(name: string) {
    return prisma.timeSlotType.findUnique({
      where: { name },
    })
  },
  async findById(id: number) {
    return prisma.timeSlotType.findUnique({
      where: { id },
    })
  },
  async delete(name: string) {
    return prisma.timeSlotType.delete({
      where: { name },
    })
  },
  async edit(type: TimeSlotType) {
    const { name, durationMinutes, amountInEuros, id } = type
    return prisma.timeSlotType.update({
      where: { id },
      data: { name, durationMinutes, amountInEuros },
    })
  },
}

export default typesModel
