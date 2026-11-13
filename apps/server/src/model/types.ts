import { prisma } from '../prisma/prisma-client'

const typesModel = {
  async findAll() {
    return await prisma.timeSlotType.findMany()
  },
}

export default typesModel
