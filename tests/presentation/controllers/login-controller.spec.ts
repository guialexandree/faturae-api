import { LoginController } from '@/presentation/controllers'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { AutenticacaoSpy, ValidationSpy } from '@/tests/presentation/mocks'
import faker from 'faker'

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
	senha: faker.internet.password()
})

interface SutTypes {
  sut: LoginController
  validacaoSpy: ValidationSpy
  autenticacaoSpy: AutenticacaoSpy
}

const makeSut = (): SutTypes => {
  const autenticacaoSpy = new AutenticacaoSpy()
  const validacaoSpy = new ValidationSpy()
  const sut = new LoginController(autenticacaoSpy, validacaoSpy)

  return {
    sut,
    validacaoSpy,
    autenticacaoSpy
  }
}

describe('LoginController', () => {
  test('Deve chamar Authentication com os valores corretos', async () => {
    const { sut, autenticacaoSpy } = makeSut()
		const request = mockRequest()

    await sut.handle(request)

    expect(autenticacaoSpy.autenticacaoParams).toEqual({
      email: request.email,
      senha: request.senha
    })
	})

  test('Deve retornar 401 se foram informadas credencias inválidas ', async () => {
		const { sut, autenticacaoSpy } = makeSut()
    autenticacaoSpy.autenticacaoModel = null

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Deve retornar 500 se Authentication der erro', async () => {
    const { sut, autenticacaoSpy } = makeSut()
    jest
      .spyOn(autenticacaoSpy, 'login')
      .mockImplementationOnce(() => { throw new Error() })

    const result = await sut.handle(mockRequest())

    expect(result).toEqual(serverError(new Error()))
  })

  test('Deve retornar 200 e um accessToken válido se Authentication for realizada com sucesso', async () => {
    const { sut, autenticacaoSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(autenticacaoSpy.autenticacaoModel))
  })

  test('Deve chamar Validation com o valor correto', async () => {
    const { sut, validacaoSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(validacaoSpy.input).toEqual(request)
  })

  test('Deve retornar status 400 se Validation retornar erro', async () => {
    const { sut, validacaoSpy } = makeSut()
    validacaoSpy.error = new MissingParamError(faker.random.word())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(validacaoSpy.error))
  })
})
