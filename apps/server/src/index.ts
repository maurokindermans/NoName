import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import userController from './controller/user'
import cors from 'cors'
import typesController from './controller/types'
import timeslotsController from './controller/timeslots'

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

app.get('/timeslots/:role/:date', timeslotsController.get)
app.post('/timeslots', timeslotsController.post)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
