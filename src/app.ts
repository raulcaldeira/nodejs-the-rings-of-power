import fastify from 'fastify'
import 'reflect-metadata'

import { ZodError } from 'zod'

import { env } from './env'
import { AppDataSource } from './database/data-source'
import { ringsRoutes } from './controllers/rings/routes'
import { bearersRoutes } from './controllers/bearers/routes'
import { ringBearersRoutes } from './controllers/ring bearer/routes'
import cors from '@fastify/cors'

export const app = fastify()

app.register(cors, {
  origin: 'http://localhost:5173', // Permitir requisições apenas do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Defina os métodos permitidos
})

app.register(ringsRoutes)
app.register(bearersRoutes)
app.register(ringBearersRoutes)

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
