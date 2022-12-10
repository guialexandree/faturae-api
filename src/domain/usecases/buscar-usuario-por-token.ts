export interface BuscarUsuarioPorToken {
  buscar: (accessToken: string, perfil?: string) => Promise<BuscarUsuarioPorToken.Result>
}

export namespace BuscarUsuarioPorToken {
	export type Result = {
		id: string
	}
}
