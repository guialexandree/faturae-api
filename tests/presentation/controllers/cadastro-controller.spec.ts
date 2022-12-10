import { CadastroController } from '@/presentation/controllers'
import { MissingParamError, EmailInUseError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers'
import { CriarUsuarioSpy, AutenticacaoSpy, ValidationSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'

const mockRequest = (): CadastroController.Request => {
  const senha = faker.internet.password()
  return {
		nome: faker.name.findName(),
		email: faker.internet.email(),
		senha,
		confirmacaoSenha: senha
  }
}

interface SutTypes {
  sut: CadastroController
  criarUsuarioSpy: CriarUsuarioSpy
  validacaoSpy: ValidationSpy
  autenticacaoSpy: AutenticacaoSpy
}

const makeSut = (): SutTypes => {
  const criarUsuarioSpy = new CriarUsuarioSpy()
  const validacaoSpy = new ValidationSpy()
  const autenticacaoSpy = new AutenticacaoSpy()
  const sut = new CadastroController(criarUsuarioSpy, validacaoSpy, autenticacaoSpy)

  return {
    sut,
    criarUsuarioSpy,
    validacaoSpy,
    autenticacaoSpy
  }
}

describe('CadastroController', () => {
  test('Deve chamar CriarUsuario com os valores corretos', async () => {
    const { sut, criarUsuarioSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(criarUsuarioSpy.criarUsuarioParams).toEqual({
      nome: request.nome,
      email: request.email,
      senha: request.senha
    })
  })

  test('Deve retornar 403 se CriarUsuario retornar null', async () => {
    const { sut, criarUsuarioSpy } = makeSut()
		criarUsuarioSpy.result = false

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Deve retornar status 500 se AddAccount der erro', async () => {
    const { sut, autenticacaoSpy } = makeSut()
    jest.spyOn(autenticacaoSpy, 'login').mockImplementationOnce(throwError)

		const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Deve chamar Authentication com os valores corretos', async () => {
    const { sut, autenticacaoSpy } = makeSut()
		const request = mockRequest()

    await sut.handle(request)

    expect(autenticacaoSpy.autenticacaoParams).toEqual({
      email: request.email,
      senha: request.senha
    })
  })

  test('Deve retornar status 200 e um accessToken', async () => {
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

  test('Deve retornar status 400 se Validation der erro', async () => {
		const { sut, validacaoSpy } = makeSut()
    validacaoSpy.error = new MissingParamError(faker.random.word())

		const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(validacaoSpy.error))
  })
})
