
import { AuthMiddleware } from '@/presentation/middlewares'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { throwError } from '@/tests/domain/mocks'
import { BuscarUsuarioPorTokenSpy } from '@/tests/presentation/mocks'

const mockRequest = (): AuthMiddleware.Request => {
  return {
		accessToken: 'any_token'
  }
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenSpy: BuscarUsuarioPorTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new BuscarUsuarioPorTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)

  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe('AuthMiddleware', () => {
	test('Deve chamar LoadAccountByToken com accessToken correto', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const request = mockRequest()

    await sut.handle(request)

    expect(loadAccountByTokenSpy.accessToken).toBe(request.accessToken)
    expect(loadAccountByTokenSpy.perfil).toBe(role)
  })

	test('Deve retornar 403 se LoadAccountByToken retornar null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
		loadAccountByTokenSpy.result = null

    const response = await sut.handle({})

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

	test('Deve retornar 200 se LoadAccountByToken retornar um usuário', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({
      accountId: loadAccountByTokenSpy.result.id
    }))
	})

  test('Deve retornar 500 se LoadAccountByToken der erro', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest
      .spyOn(loadAccountByTokenSpy, 'buscar')
      .mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
