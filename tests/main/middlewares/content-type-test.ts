import request from 'supertest'
import { setupApp } from '@/main/config/app'
import { Express } from 'express'

let app: Express

describe('Content Type Middleware', () => {
	beforeAll(async () => {
    app = await setupApp()
  })

  test('Deve retornar o content-type json por padrão', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Deve retornar o content-type xml quando forçado', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
