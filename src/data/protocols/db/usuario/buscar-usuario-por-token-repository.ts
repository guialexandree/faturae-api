export interface BuscarUsuarioPorTokenRepository {
  buscarPorToken: (token: string, perfil?: string) => Promise<BuscarUsuarioPorTokenRepository.Result>
}

export namespace BuscarUsuarioPorTokenRepository {
	export type Result = { id: string }
}
