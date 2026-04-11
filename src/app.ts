import express from 'express'
import cors from 'cors'

import customersRouter from './modules/customers/customers.routes'
import paymentsRouter from './modules/payments/payments.routes'
import treatmentsRouter from './modules/treatments/treatments.routes'
import usersRouter from './modules/users/users.routes'
import packageJson from '../package.json'

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
    res.json({
        message: 'API is running 🚀',
        status: 'online',
        version: packageJson.version,
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
    })
})

app.use('/users', usersRouter)
app.use('/customers', customersRouter)
app.use('/payments', paymentsRouter)
app.use('/treatments', treatmentsRouter)