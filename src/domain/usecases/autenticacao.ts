export interface Autenticacao {
	login: (params: Autenticacao.Params) => Promise<Autenticacao.Result>
}

export namespace Autenticacao {
	export type Params = {
		email: string
		senha: string
	}

	export type Result = {
		nome: string
		accessToken: string
	}
}
