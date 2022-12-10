export interface BuscarUsuarioPorEmailRepository {
  buscarPorEmail: (email: string) => Promise<BuscarUsuarioPorEmailRepository.Result>
}

export namespace BuscarUsuarioPorEmailRepository {
	export type Result = {
		id: string
		nome: string
		senha: string
	}
}
