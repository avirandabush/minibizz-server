import express from 'express'
import cors from 'cors'

import customersRouter from './modules/customers/customers.routes'
import paymentsRouter from './modules/payments/payments.routes'
import treatmentsRouter from './modules/treatments/treatments.routes'
import usersRouter from './modules/users/users.routes'

export const app = express()

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://minibizz.avirandabush.co.il'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is running 🚀')
})

app.use('/users', usersRouter)
app.use('/customers', customersRouter)
app.use('/payments', paymentsRouter)
app.use('/treatments', treatmentsRouter)