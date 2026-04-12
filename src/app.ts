import express from 'express'
import cors from 'cors'

import { initializeFirebase } from './config/firebase'
import customersRouter from './modules/customers/customers.routes'
import paymentsRouter from './modules/payments/payments.routes'
import treatmentsRouter from './modules/treatments/treatments.routes'
import usersRouter from './modules/users/users.routes'
import packageJson from '../package.json'

try {
    initializeFirebase()
} catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    process.exit(1);
}

export const app = express()

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://minibizz.avirandabush.co.il'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-dev-token']
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