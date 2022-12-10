import { Autenticacao } from '@/domain/usecases'
import { DbAutenticao } from '@/data/usecases'
import { mockAutenticacaoParams, throwError } from '@/tests/domain/mocks'
import { AtualizarAccessTokenRepositorySpy, EncrypterSpy, HashComparerSpy, BuscarUsuarioPorEmailRepositorySpy } from '@/tests/data/mocks'

interface SutTypes {
  sut: Autenticacao
  buscarUsuarPorEmailRepositorySpy: BuscarUsuarioPorEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  atualizarAccessTokenRepositorySpy: AtualizarAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const buscarUsuarPorEmailRepositorySpy = new BuscarUsuarioPorEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const atualizarAccessTokenRepositorySpy = new AtualizarAccessTokenRepositorySpy()

  const sut = new DbAutenticao(
    buscarUsuarPorEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    atualizarAccessTokenRepositorySpy
  )

  return {
    sut,
    buscarUsuarPorEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    atualizarAccessTokenRepositorySpy
  }
}

describe('Caso de uso - DbAuthentication', () => {
  test('Deve chamar BuscarUsuarPorEmailRepository com o e-mail correto', async () => {
    const { sut, buscarUsuarPorEmailRepositorySpy } = makeSut()
		const autenticacao = mockAutenticacaoParams()

    await sut.login(autenticacao)

    expect(buscarUsuarPorEmailRepositorySpy.email).toBe(autenticacao.email)
  })

  test('Deve propagar o erro se BuscarUsuarPorEmailRepository der erro', async () => {
    const { sut, buscarUsuarPorEmailRepositorySpy } = makeSut()
    jest
      .spyOn(buscarUsuarPorEmailRepositorySpy, 'buscarPorEmail')
      .mockImplementationOnce(throwError)

    const promise = sut.login(mockAutenticacaoParams())

    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar null se BuscarUsuarPorEmailRepository retornar null', async () => {
    const { sut, buscarUsuarPorEmailRepositorySpy } = makeSut()
		buscarUsuarPorEmailRepositorySpy.result = null

    const account = await sut.login(mockAutenticacaoParams())

    expect(account).toBeNull()
  })

  test('Deve chamar HashComparer com os valores corretos', async () => {
    const { sut, hashComparerSpy, buscarUsuarPorEmailRepositorySpy } = makeSut()
		const autenticacaoParams = mockAutenticacaoParams()

    await sut.login(autenticacaoParams)

    expect(hashComparerSpy.plaintext).toBe(autenticacaoParams.senha)
    expect(hashComparerSpy.digest).toBe(buscarUsuarPorEmailRepositorySpy.result.senha)
  })

  test('Deve propagar o erro se HashComparer der erro', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest
      .spyOn(hashComparerSpy, 'compare')
      .mockImplementationOnce(throwError)

    const promise = sut.login(mockAutenticacaoParams())

    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar null se HashComparer retornar false', async () => {
    const { sut, hashComparerSpy } = makeSut()
		hashComparerSpy.isValid = false

    const accessToken = await sut.login(mockAutenticacaoParams())

    expect(accessToken).toBeNull()
  })

  test('Deve retornar um modelo de Usuário com sucesso', async () => {
    const { sut, encrypterSpy, buscarUsuarPorEmailRepositorySpy } = makeSut()

    const { accessToken, nome } = await sut.login(mockAutenticacaoParams())

    expect(accessToken).toBe(encrypterSpy.ciphertext)
    expect(buscarUsuarPorEmailRepositorySpy.result.nome).toBe(nome)
  })

  test('Deve chamar Encrypter com texto simples', async () => {
    const { sut, encrypterSpy, buscarUsuarPorEmailRepositorySpy } = makeSut()

    await sut.login(mockAutenticacaoParams())

    expect(encrypterSpy.plaintext).toBe(buscarUsuarPorEmailRepositorySpy.result.id)
  })

	test('Deve propagar o erro se Encrypter der erro', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest
      .spyOn(encrypterSpy, 'encrypt')
      .mockImplementationOnce(throwError)

    const promise = sut.login(mockAutenticacaoParams())

    await expect(promise).rejects.toThrow()
  })

  test('Deve chamar AtualizarAccessTokenRepository com so valores corretos', async () => {
    const { sut, atualizarAccessTokenRepositorySpy, buscarUsuarPorEmailRepositorySpy, encrypterSpy } = makeSut()

    await sut.login(mockAutenticacaoParams())

    expect(atualizarAccessTokenRepositorySpy.id).toBe(buscarUsuarPorEmailRepositorySpy.result.id)
    expect(atualizarAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext)
  })

  test('Deve propagar o erro se AtualizarAccessTokenRepository retornar erro', async () => {
    const { sut, atualizarAccessTokenRepositorySpy } = makeSut()
    jest
      .spyOn(atualizarAccessTokenRepositorySpy, 'atualizarAccessToken')
      .mockImplementationOnce(throwError)

    const promise = sut.login(mockAutenticacaoParams())

    await expect(promise).rejects.toThrow()
  })
})
