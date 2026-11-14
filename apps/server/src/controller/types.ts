import typesModel from '../model/types'
import { Request, Response } from 'express'

const typesController = {
  async get(_req: Request, res: Response) {
    const types = await typesModel.findAll()
    res.json(types)
  },
  async post(req: Request, res: Response) {
    let type = await typesModel.findByName(req.body.name)
    if (type) {
      res.status(400).json({ error: 'Type already exists' })
    } else {
      type = await typesModel.create(req.body)
      res.json(type)
    }
  },
}

export default typesController
