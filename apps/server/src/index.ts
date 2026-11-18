import express, { Express } from 'express'
import dotenv from 'dotenv'
import userController from './controller/user'
import cors from 'cors'
import typesController from './controller/types'
import timeslotsController from './controller/timeslots'
import cancelTimeController from './controller/canceltime'

dotenv.config()

const PORT = process.env.PORT
const app: Express = express()

app.use(cors())
app.use(express.json())

app.post('/login', userController.login)

app.get('/types', typesController.get)
app.post('/types', typesController.post)
app.delete('/types', typesController.delete)
app.put('/types', typesController.put)

app.get('/timeslots/:userid/:date', timeslotsController.get)
app.post('/timeslots', timeslotsController.post)
app.delete('/timeslots', timeslotsController.delete)
app.put('/timeslots', timeslotsController.put)
app.get('/timeslots/:clientId', timeslotsController.clientTimeSlots)
app.put('/timeslots/cancel', timeslotsController.cancelTimeslot)

app.get('/canceltime', cancelTimeController.get)
app.put('/canceltime', cancelTimeController.put)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
