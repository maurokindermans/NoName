import { User } from '../prisma/generated/prisma/client'
import { prisma } from '../prisma/prisma-client'

const userModel = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  },
  async create(user: User) {
    return prisma.user.create({ data: user })
  },
  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    })
  },
}

export default userModel
