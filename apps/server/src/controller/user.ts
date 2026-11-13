import { Request, Response } from 'express'
import userModel from '../model/user'

const userController = {
  async login(req: Request, res: Response) {
    const user = await userModel.findByEmail(req.body.email)

    if (user) {
      res.json(user)
    } else {
      const newUser = await userModel.createUser(req.body)
      res.json(newUser)
    }
  },
}

export default userController
