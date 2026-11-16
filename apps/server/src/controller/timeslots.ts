import { Request, Response } from 'express'
import typesModel from '../model/types'
import timeslotsModel from '../model/timeslots'

import cancelTimeModel from '../model/canceltime'

const timeslotsController = {
  async get(req: Request, res: Response) {
    let timeslots
    if (req.params.role === 'PROFESSIONAL') {
      if (typeof req.params.date === 'string') {
        timeslots = await timeslotsModel.findAllByDate(
          new Date(req.params.date)
        )
      }
    } else {
      if (typeof req.params.date === 'string') {
        timeslots = await timeslotsModel.findAvailableByDate(
          new Date(req.params.date)
        )
      }
    }

    res.json(timeslots)
  },
  async post(req: Request, res: Response) {
    let { startTime, type } = req.body
    const timeSlotType = await typesModel.findByName(type)

    if (!timeSlotType) {
      res.status(400).json({ error: 'Type does not exist' })
      return
    }
    startTime = new Date(startTime)

    const cancelTime = (await cancelTimeModel.find())?.amountInHours
    const typeId = timeSlotType.id
    const endPrice = timeSlotType.amountInEuros
    const endTime = new Date(
      startTime.valueOf() + parseInt(timeSlotType.durationMinutes) * 60000
    )

    const newTimeSlot = await timeslotsModel.create({
      endTime,
      type,
      typeId,
      startTime,
      endPrice,
      cancelTime,
    })
    res.json(newTimeSlot)
  },
}
export default timeslotsController
