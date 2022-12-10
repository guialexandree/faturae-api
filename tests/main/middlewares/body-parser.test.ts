import request from 'supertest'
import { setupApp } from '@/main/config/app'
import { Express } from 'express'

let app: Express

describe('Body Parser Middleware', () => {
	beforeAll(async () => {
    app = await setupApp()
  })

  test('Deve fazer um parse do body para json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ nome: 'Guilherme Alexandre' })
      .expect({ nome: 'Guilherme Alexandre' })
  })
})
