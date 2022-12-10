import { Autenticacao } from '@/domain/usecases'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class LoginController implements Controller {
  constructor (
    private readonly autenticacao: Autenticacao,
    private readonly validacao: Validation
  ) { }

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const erro = this.validacao.validate(request)
      if (erro) {
        return badRequest(erro)
      }

      const { email, senha } = request

      const autenticacaoModel = await this.autenticacao.login({ email, senha })
      if (!autenticacaoModel) {
        return unauthorized()
      }

      return ok(autenticacaoModel)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoginController {
	export type Request = {
		email: string
		senha: string
	}
}
