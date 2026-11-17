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

    let cancelTime = (await cancelTimeModel.find())?.amountInHours

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
  async delete(req: Request, res: Response) {
    const timeSlot = await timeslotsModel.findById(req.body.id)
    if (timeSlot) {
      await timeslotsModel.delete(timeSlot.id)
      res.json({ message: `Time slot has been deleted` })
    } else {
      res.status(400).json({ error: "Time slot doesn't exist" })
    }
  },
  async put(req: Request, res: Response) {
    const timeSlot = await timeslotsModel.findById(req.body.id)
    if (timeSlot) {
      if (timeSlot.clientId) {
        res.status(400).json({ error: 'Time slot already booked' })
        return
      }
      await timeslotsModel.update({
        id: timeSlot.id,
        clientId: req.body.clientId,
      })
      res.json({ message: `Time slot has been booked` })
    } else {
      res.status(400).json({ error: "Time slot doesn't exist" })
    }
  },
  async clientTimeSlots(req: Request, res: Response) {
    const timeslots = await timeslotsModel.findAllByClientid(
      parseInt(String(req.params.clientId))
    )
    res.json(timeslots)
  },
  async cancelTimeslot(req: Request, res: Response) {
    console.log('CANCEL!')
    const timeSlot = await timeslotsModel.findById(req.body.id)
    if (timeSlot) {
      if (!timeSlot.clientId) {
        res.status(400).json({ error: 'Time slot already canceled' })
        return
      }
      await timeslotsModel.update({
        id: timeSlot.id,
        clientId: null,
      })
      res.json({ message: `Time slot has been canceled` })
    } else {
      res.status(400).json({ error: "Time slot doesn't exist" })
    }
  },
}
export default timeslotsController
