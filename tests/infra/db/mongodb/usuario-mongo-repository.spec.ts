import { MongoHelper, UsuarioMongoRepository } from '@/infra/db/mongodb'

import { mockCriarUsuarioParams, throwError } from '@/tests/domain/mocks'
import { Collection } from 'mongodb'
import faker from 'faker'

let usuarioCollection: Collection

const makeSut = (): UsuarioMongoRepository => {
  return new UsuarioMongoRepository()
}

describe('UsuarioMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    usuarioCollection = MongoHelper.getCollection('usuarios')
    await usuarioCollection.deleteMany({})
  })

	describe('salvar()', () => {
		test('Deve retornar true se o usuário for criado', async () => {
			const sut = makeSut()
			const criarUsuarioParams = mockCriarUsuarioParams()

			const criouUsuario = await sut.salvar(criarUsuarioParams)

			expect(criouUsuario).toBe(true)
		})
	})

	describe('buscarPorEmail()', () => {
		test('Deve retornar usuário se o loadByEmail retornar o usuário', async () => {
			const sut = makeSut()
			const criarUsuarioParams = mockCriarUsuarioParams()
      await usuarioCollection.insertOne(criarUsuarioParams)

      const usuario = await sut.buscarPorEmail(criarUsuarioParams.email)

			expect(usuario).toBeTruthy()
			expect(usuario.id).toBeTruthy()
			expect(usuario.nome).toBe(criarUsuarioParams.nome)
			expect(usuario.senha).toBe(criarUsuarioParams.senha)
		})

		test('Deve retornar null se loadByEmail falhar', async () => {
			const sut = makeSut()

			const account = await sut.buscarPorEmail(faker.internet.email())

			expect(account).toBeFalsy()
		})
	})

	describe('validarPorEmail()', () => {
		test('Deve retornar true se email é válido', async () => {
			const sut = makeSut()
			const criariUsuarioParams = mockCriarUsuarioParams()
      await usuarioCollection.insertOne(criariUsuarioParams)

      const existeUsuario = await sut.validarUsuario(criariUsuarioParams.email)

			expect(existeUsuario).toBe(true)
		})

		test('Deve retornar false se email está sendo usado por outro usuário', async () => {
			const sut = makeSut()

			const existeUsuario = await sut.validarUsuario(mockCriarUsuarioParams().email)

			expect(existeUsuario).toBe(false)
		})
	})

	describe('atualizarAccessToken()', () => {
		test('Deve atualizar o usuario com sucesso', async () => {
			const sut = makeSut()
			const criarUsuarioParams = mockCriarUsuarioParams()
			const { insertedId } = await usuarioCollection.insertOne(criarUsuarioParams)
			const accessToken = faker.datatype.uuid()
			await sut.atualizarAccessToken(insertedId.toString(), accessToken)

			const usuario = await usuarioCollection.findOne({ _id: insertedId })

			expect(usuario).toBeTruthy()
			expect(usuario.accessToken).toBe(accessToken)
		})

		test('Deve progagar o erro se AtualizarAccessToken der erro', async () => {
			const sut = makeSut()
			const criarUsuarioParams = mockCriarUsuarioParams()
			const { insertedId } = await usuarioCollection.insertOne(criarUsuarioParams)
			jest
				.spyOn(sut, 'atualizarAccessToken')
				.mockReturnValueOnce(Promise.reject(throwError))

			const promise = sut.atualizarAccessToken(insertedId.toString(), 'any_token')

			await expect(promise).rejects.toThrow()
		})
	})

	describe('buscarPorToken()', () => {
    let nome = faker.name.findName()
    let email = faker.internet.email()
    let senha = faker.internet.password()
    let accessToken = faker.datatype.uuid()

    beforeEach(() => {
      nome = faker.name.findName()
      email = faker.internet.email()
      senha = faker.internet.password()
      accessToken = faker.datatype.uuid()
    })

		test('Deve retornar um usuário no loadByToken sem o perfil', async () => {
			const sut = makeSut()
			await usuarioCollection.insertOne({
				nome,
				email,
				senha,
				accessToken
			})

			const usuario = await sut.buscarPorToken(accessToken)

			expect(usuario).toBeTruthy()
			expect(usuario.id).toBeTruthy()
		})

		test('Deve retornar um usuário no loadByToken quando usuário da buscar não tem perfil', async () => {
			const sut = makeSut()
			await usuarioCollection.insertOne({
				nome,
				email,
				senha,
				accessToken,
				perfil: 'admin'
			})

			const usuario = await sut.buscarPorToken(accessToken, 'admin')

			expect(usuario).toBeTruthy()
			expect(usuario.id).toBeTruthy()
		})

		test('Deve retornar null no loadAccountByToken devido usuário da busca não possuir perfil válido', async () => {
			const sut = makeSut()
			await usuarioCollection.insertOne({
				nome,
        email,
        senha,
        accessToken
			})

			const account = await sut.buscarPorToken(accessToken, 'admin')

			expect(account).toBeFalsy()
		})

		test('Deve retornar um usuário no loadAccountByToken se o usuário que buscou for perfil admin', async () => {
			const sut = makeSut()
			await usuarioCollection.insertOne({
				nome,
        email,
        senha,
        accessToken,
				perfil: 'admin'
			})

			const usuario = await sut.buscarPorToken(accessToken)

			expect(usuario).toBeTruthy()
			expect(usuario.id).toBeTruthy()
		})

		test('Deve retornar null se loadByToken falhar', async () => {
			const sut = makeSut()

			const usuario = await sut.buscarPorToken(accessToken)

			expect(usuario).toBeFalsy()
		})
	})
})
