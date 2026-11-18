import { prisma } from '../prisma/prisma-client'

const cancelTimeModel = {
  async find() {
    return prisma.cancelTime.findUnique({ where: { id: 1 } })
  },

  async updateAmountInHours(amountInHours: string) {
    return prisma.cancelTime.update({
      where: { id: 1 },
      data: { amountInHours },
    })
  },
}

export default cancelTimeModel
