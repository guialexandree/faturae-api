export interface ValidarUsuarioPorEmailRepository {
  validarUsuario: (email: string) => Promise<ValidarUsuarioPorEmailRepository.Result>
}

export namespace ValidarUsuarioPorEmailRepository {
	export type Result = boolean
}
