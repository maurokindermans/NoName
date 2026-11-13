import { User } from '../prisma/generated/prisma/client'
import { prisma } from '../prisma/prisma-client'

const userModel = {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    })
  },
  async createUser(user: User) {
    return prisma.user.create({ data: user })
  },
}

export default userModel
