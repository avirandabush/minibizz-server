import express from 'express'
import cors from 'cors'

import customersRouter from './modules/customers/customers.routes'
import paymentsRouter from './modules/payments/payments.routes'
import treatmentsRouter from './modules/treatments/treatments.routes'
import usersRouter from './modules/users/users.routes'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is running 🚀')
})

app.use('/users', usersRouter)
app.use('/customers', customersRouter)
app.use('/payments', paymentsRouter)
app.use('/treatments', treatmentsRouter)