import { DbBuscarUsuarioPorToken } from '@/data/usecases'
import { DecrypterSpy, BuscarUsuarioPorTokenRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'

type SutTypes = {
	sut: DbBuscarUsuarioPorToken
	decrypterSpy: DecrypterSpy
	buscarUsuarioPorTokenRepositorySpy: BuscarUsuarioPorTokenRepositorySpy
}

let token: string
let perfil: string

const makeSut = (): SutTypes => {
	const decrypterSpy = new DecrypterSpy()
	const buscarUsuarioPorTokenRepositorySpy = new BuscarUsuarioPorTokenRepositorySpy()
	const sut = new DbBuscarUsuarioPorToken(decrypterSpy, buscarUsuarioPorTokenRepositorySpy)
	return {
		sut,
		decrypterSpy,
		buscarUsuarioPorTokenRepositorySpy
	}
}

describe('Case de uso - DbLoadAccountByToken', () => {
	beforeEach(() => {
		token = faker.datatype.uuid()
		perfil = faker.random.word()
	})

	test('Deve chamar Decrypter com o valor correto', async () => {
		const { sut, decrypterSpy } = makeSut()

		await sut.buscar(token, perfil)

		expect(decrypterSpy.ciphertext).toBe(token)
	})

	test('Deve retornar null se Decrypter retornar null', async () => {
		const { sut, decrypterSpy } = makeSut()
		decrypterSpy.plaintext = null

		const account = await sut.buscar(token, perfil)

		expect(account).toBeNull()
	})

	test('Deve chamar BuscarUsuarioPorTokenRepository com os valores corretos', async () => {
		const { sut, buscarUsuarioPorTokenRepositorySpy } = makeSut()

		await sut.buscar(token, perfil)

		expect(buscarUsuarioPorTokenRepositorySpy.token).toBe(token)
		expect(buscarUsuarioPorTokenRepositorySpy.perfil).toBe(perfil)
	})

	test('Deve retornar null se BuscarUsuarioPorTokenRepository retornar null', async () => {
		const { sut, buscarUsuarioPorTokenRepositorySpy } = makeSut()
		buscarUsuarioPorTokenRepositorySpy.result = null

		const account = await sut.buscar(token, perfil)

		expect(account).toBeNull()
	})

	test('Deve retornar um usuário com sucesso', async () => {
		const { sut, buscarUsuarioPorTokenRepositorySpy } = makeSut()

		const account = await sut.buscar(token, perfil)

		expect(account).toEqual(buscarUsuarioPorTokenRepositorySpy.result)
	})

	test('Deve propagar o erro se ocorrer erro no LoadAccountByTokenRepository', async () => {
    const { sut, buscarUsuarioPorTokenRepositorySpy } = makeSut()
    jest
      .spyOn(buscarUsuarioPorTokenRepositorySpy, 'buscarPorToken')
      .mockImplementationOnce(throwError)

    const promise = sut.buscar(token, perfil)

    await expect(promise).rejects.toThrow()
  })

	test('Deve progagar o erro se ocorrer erro no Decrypter', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest
      .spyOn(decrypterSpy, 'decrypt')
      .mockImplementationOnce(throwError)

    const account = await sut.buscar('any_token', 'any_role')

    expect(account).toBeNull()
  })
})
