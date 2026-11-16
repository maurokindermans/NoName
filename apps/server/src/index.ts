import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import userController from './controller/user'
import cors from 'cors'
import typesController from './controller/types'

dotenv.config()

const PORT = process.env.PORT
const app: Express = express()

app.use(cors())
app.use(express.json())

app.get('/', (_: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.get('/types', typesController.get)
app.post('/types', typesController.post)
app.delete('/types', typesController.delete)
app.put('/types', typesController.put)

app.post('/login', userController.login)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
