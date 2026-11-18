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

  async delete(req: Request, res: Response) {
    const type = await typesModel.findById(req.body.id)
    if (type) {
      await typesModel.delete(type.name)
      res.json({ message: `${type.name} has been deleted` })
    } else {
      res.status(400).json({ error: "Type doesn't exist" })
    }
  },

  async put(req: Request, res: Response) {
    let type = await typesModel.findById(req.body.id)
    if (type) {
      await typesModel.edit(req.body)
      res.json({ message: `${type.name} has been edited` })
    } else {
      res.status(400).json({ error: "Type doesn't exist" })
    }
  },
}

export default typesController
