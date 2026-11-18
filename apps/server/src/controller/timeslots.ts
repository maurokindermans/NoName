import { Request, Response } from 'express'
import typesModel from '../model/types'
import timeslotsModel from '../model/timeslots'

import cancelTimeModel from '../model/canceltime'
import userModel from '../model/user'

const timeslotsController = {
  async get(req: Request, res: Response) {
    const userId = Number.parseInt(String(req.params.userid))

    // Get user from the database and infer its role
    const user = await userModel.findById(userId)
    if (!user) {
      res.status(404).json({ error: 'user not found' })
      return
    }

    // We want to get all the timeslots
    const timeslots = await timeslotsModel.findAllByDate(
      new Date(String(req.params.date))
    )
    // Process timeslots so they don't contain sensitive information
    // instead, we want to provide status to be: 'claimed|taken|available'
    const processedSlots = timeslots.map((current) => {
      if (user.role === 'PROFESSIONAL') {
        return current
      } else {
        let status
        if ((current.clientId as number) === userId) {
          status = 'claimed'
        } else if (current.clientId === null) {
          status = 'available'
        } else {
          status = 'taken'
        }
        return {
          ...current,
          clientId: undefined,
          status,
        }
      }
    })

    res.json(processedSlots)
  },

  async post(req: Request, res: Response) {
    let { startTime, type } = req.body
    const timeSlotType = await typesModel.findByName(type)

    if (!timeSlotType) {
      res.status(400).json({ error: 'Type does not exist' })
      return
    }

    startTime = new Date(startTime)
    const cancelTimeInhours = (await cancelTimeModel.find())?.amountInHours

    if (cancelTimeInhours === undefined) {
      res.status(404).json({ error: 'Cancel time not found' })
      return
    }

    let cancelTime

    if (cancelTimeInhours === '') {
      cancelTime = undefined
    } else {
      cancelTime = new Date(startTime)
      cancelTime.setHours(cancelTime.getHours() - parseInt(cancelTimeInhours))
    }

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
