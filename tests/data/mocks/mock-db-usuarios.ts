import { CriarUsuario } from '@/domain/usecases'
import { CriarUsuarioRepository, ValidarUsuarioPorEmailRepository, BuscarUsuarioPorEmailRepository, BuscarUsuarioPorTokenRepository, AtualizarAccessTokenRepository } from '@/data/protocols'
import faker from 'faker'

export class AddAccountRepositorySpy implements CriarUsuarioRepository {
	result = true
  criarUsuarioParams: CriarUsuario.Params

  async salvar (usuarioData: CriarUsuario.Params): Promise<CriarUsuarioRepository.Result> {
    this.criarUsuarioParams = usuarioData
    return await Promise.resolve(this.result)
  }
}

export class BuscarUsuarioPorEmailRepositorySpy implements BuscarUsuarioPorEmailRepository {
	result = {
		id: faker.datatype.uuid(),
		nome: faker.name.findName(),
		senha: faker.internet.password()
	}

	email: string

	async buscarPorEmail (email: string): Promise<BuscarUsuarioPorEmailRepository.Result> {
		this.email = email
		return await Promise.resolve(this.result)
	}
}

export class ValidarUsuarioPorEmailRepositorySpy implements ValidarUsuarioPorEmailRepository {
	result = false
	email: string

	async validarUsuario (email: string): Promise<ValidarUsuarioPorEmailRepository.Result> {
		this.email = email
		return await Promise.resolve(this.result)
	}
}

export class BuscarUsuarioPorTokenRepositorySpy implements BuscarUsuarioPorTokenRepository {
	result = { id: faker.datatype.uuid() }
	token: string
	perfil: string

	async buscarPorToken (token: string, perfil?: string): Promise<BuscarUsuarioPorTokenRepository.Result> {
		this.token = token
		this.perfil = perfil
		return await Promise.resolve(this.result)
	}
}

export class AtualizarAccessTokenRepositorySpy implements AtualizarAccessTokenRepository {
	id: string
	token: string

	async atualizarAccessToken (id: string, token: string): Promise<void> {
		this.id = id
		this.token = token
		return await Promise.resolve()
	}
}
