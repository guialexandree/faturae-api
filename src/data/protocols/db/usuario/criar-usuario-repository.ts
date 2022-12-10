import { CriarUsuario } from '@/domain/usecases'

export interface CriarUsuarioRepository {
  salvar: (data: CriarUsuario.Params) => Promise<CriarUsuario.Result>
}

export namespace CriarUsuarioRepository {
	export type Params = CriarUsuario.Params
	export type Result = boolean
}
