import { DbCriarUsuario } from '@/data/usecases'
import { mockCriarUsuarioParams, throwError } from '@/tests/domain/mocks'
import { AddAccountRepositorySpy, ValidarUsuarioPorEmailRepositorySpy, HasherSpy } from '@/tests/data/mocks'

interface SutTypes {
  sut: DbCriarUsuario
  hasherSpy: HasherSpy
  criarUsuarioRepositorySpy: AddAccountRepositorySpy
  validarUsuarioPorEmailRepositorySpy: ValidarUsuarioPorEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const validarUsuarioPorEmailRepositorySpy = new ValidarUsuarioPorEmailRepositorySpy()
  const criarUsuarioRepositorySpy = new AddAccountRepositorySpy()
  const hasherSpy = new HasherSpy()
  const sut = new DbCriarUsuario(hasherSpy, criarUsuarioRepositorySpy, validarUsuarioPorEmailRepositorySpy)

	return {
    sut,
    hasherSpy,
    criarUsuarioRepositorySpy,
    validarUsuarioPorEmailRepositorySpy
  }
}

describe('Caso de uso - DbAddAccount', () => {
  test('Deve chamar ValidarUsuarioPorEmailRepository com o e-mail correto', async () => {
    const { sut, validarUsuarioPorEmailRepositorySpy } = makeSut()
		const addAccountParams = mockCriarUsuarioParams()

    await sut.criar(addAccountParams)

    expect(validarUsuarioPorEmailRepositorySpy.email).toBe(addAccountParams.email)
  })

	test('Deve retornar false se ValidarUsuarioPorEmailRepository retornar true', async () => {
    const { sut, validarUsuarioPorEmailRepositorySpy } = makeSut()
		validarUsuarioPorEmailRepositorySpy.result = true

		const usuarioCriado = await sut.criar(mockCriarUsuarioParams())

    expect(usuarioCriado).toBe(false)
  })

  test('Deve chamar Hasher com a senha correta', async () => {
    const { sut, hasherSpy } = makeSut()
		const usuarioData = mockCriarUsuarioParams()

    await sut.criar(usuarioData)

    expect(hasherSpy.plaintext).toBe(usuarioData.senha)
  })

  test('Deve propagar o erro se Hasher der erro', async () => {
    const { sut, hasherSpy } = makeSut()
    jest
      .spyOn(hasherSpy, 'hash')
      .mockImplementationOnce(throwError)

    const promise = sut.criar(mockCriarUsuarioParams())

    await expect(promise).rejects.toThrow()
  })

  test('Deve chamar CriarUsuarioRepository com os valores corretos', async () => {
    const { sut, criarUsuarioRepositorySpy, hasherSpy } = makeSut()
    const addAccountParams = mockCriarUsuarioParams()

    await sut.criar(addAccountParams)

    expect(criarUsuarioRepositorySpy.criarUsuarioParams).toEqual({
      nome: addAccountParams.nome,
      email: addAccountParams.email,
      senha: hasherSpy.digest
    })
  })

  test('Deve propagar o erro se CriarUsuarioRepository retornar erro', async () => {
    const { sut, criarUsuarioRepositorySpy } = makeSut()
    jest
			.spyOn(criarUsuarioRepositorySpy, 'salvar')
			.mockImplementationOnce(throwError)

    const promise = sut.criar(mockCriarUsuarioParams())

    await expect(promise).rejects.toThrow()
  })

  test('Deve retornar true se usuário criado com sucesso', async () => {
    const { sut } = makeSut()

    const criouUsuario = await sut.criar(mockCriarUsuarioParams())

    expect(criouUsuario).toBe(true)
  })

	test('Deve retornar false se CriarUsuarioRepository returns false', async () => {
    const { sut, criarUsuarioRepositorySpy } = makeSut()
		criarUsuarioRepositorySpy.result = false

		const criouUsuario = await sut.criar(mockCriarUsuarioParams())

    expect(criouUsuario).toBe(false)
  })
})
