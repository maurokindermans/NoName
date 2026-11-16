import { prisma } from '../prisma/prisma-client'

const cancelTimeModel = {
  async find() {
    return prisma.cancelTime.findUnique({ where: { id: 1 } })
  },
}

export default cancelTimeModel
