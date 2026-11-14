import { TimeSlotType } from '../prisma/generated/prisma/client'
import { prisma } from '../prisma/prisma-client'

const typesModel = {
  async findAll() {
    return await prisma.timeSlotType.findMany()
  },
  async create(type: TimeSlotType) {
    return prisma.timeSlotType.create({ data: type })
  },
  async findByName(name: string) {
    return await prisma.timeSlotType.findUnique({
      where: { name },
    })
  },
}

export default typesModel
