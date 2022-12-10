export interface CriarUsuario {
  criar: (account: CriarUsuario.Params) => Promise<CriarUsuario.Result>
}

export namespace CriarUsuario {
	export type Params = {
		nome: string
		email: string
		senha: string
	}

	export type Result = boolean
}
