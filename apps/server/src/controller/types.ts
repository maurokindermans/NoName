import typesModel from '../model/types'
import { Request, Response } from 'express'

const typesController = {
  async get(_req: Request, res: Response) {
    const types = await typesModel.findAll()
    res.json(types)
  },
}

export default typesController
