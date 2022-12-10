import request from 'supertest'
import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { Express } from 'express'

let app: Express
let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('usuarios')
    await accountCollection.deleteMany({})
  })

  describe('POST /cadastro', () => {
    test('Deve retornar 200 quando cadastrado usuário', async () => {
      await request(app)
        .post('/api/cadastro')
        .send({
          nome: 'Guilherme Alexandre',
          email: 'guilherme_alexandr22e@hotmail.com',
          senha: 'any_password',
          confirmacaoSenha: 'any_password'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Deve retornar 200 quando realizado login', async () => {
      const senha = await hash('123', 12)
      await accountCollection.insertOne({
        nome: 'Guilherme Alexandre',
        email: 'guilherme_alexandre@hotmail.com',
        senha
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'guilherme_alexandre@hotmail.com',
          senha: '123'
        })
        .expect(200)
    })

    test('Deve retornar 401 se o login falhar', async () => {
      const senha = await hash('123', 12)
      await accountCollection.insertOne({
        nome: 'Guilherme Alexandre',
        email: 'guilherme_alexandre@hotmail.com',
        senha
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'guilherme_alexandre@hotmail.com',
          senha: 'password_incorrect'
        })
        .expect(401)
    })
  })
})
