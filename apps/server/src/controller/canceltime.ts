import { Request, Response } from 'express'
import cancelTimeModel from '../model/canceltime'

const cancelTimeController = {
  async get(_req: Request, res: Response) {
    const cancelTime = await cancelTimeModel.find()
    res.json(cancelTime)
  },

  async put(req: Request, res: Response) {
    await cancelTimeModel.updateAmountInHours(req.body.amountInHours)
    res.json({ message: 'Updated cancel time' })
  },
}

export default cancelTimeController
