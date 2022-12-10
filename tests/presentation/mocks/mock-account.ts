import { CriarUsuario, Autenticacao, BuscarUsuarioPorToken } from '@/domain/usecases'
import faker from 'faker'

export class CriarUsuarioSpy implements CriarUsuario {
	result = true
  criarUsuarioParams: CriarUsuario.Params

  async criar (usuario: CriarUsuario.Params): Promise<CriarUsuario.Result> {
    this.criarUsuarioParams = usuario
    return this.result
  }
}

export class AutenticacaoSpy implements Autenticacao {
	autenticacaoParams: Autenticacao.Params
  autenticacaoModel = {
    accessToken: faker.datatype.uuid(),
    nome: faker.name.findName()
  }

  async login (autenticacaoParams: Autenticacao.Params): Promise<Autenticacao.Result> {
    this.autenticacaoParams = autenticacaoParams
    return await Promise.resolve(this.autenticacaoModel)
  }
}

export class BuscarUsuarioPorTokenSpy implements BuscarUsuarioPorToken {
	result = {
		id: faker.datatype.uuid()
	}

  accessToken: string
  perfil: string

  async buscar (accessToken: string, perfil?: string): Promise<BuscarUsuarioPorToken.Result> {
    this.accessToken = accessToken
    this.perfil = perfil
    return await Promise.resolve(this.result)
  }
}
