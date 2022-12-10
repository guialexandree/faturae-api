import { CriarUsuario, Autenticacao } from '@/domain/usecases'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers'
import { EmailInUseError } from '@/presentation/errors'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class CadastroController implements Controller {
  constructor (
    private readonly addAccount: CriarUsuario,
    private readonly validation: Validation,
    private readonly autenticacao: Autenticacao
  ) {}

  async handle (request: CadastroController.Request): Promise<HttpResponse> {
    try {
      const erro = this.validation.validate(request)
      if (erro) {
        return badRequest(erro)
      }

      const { nome, senha, email } = request

      const criouUsuario = await this.addAccount.criar({
        nome,
        email,
        senha
      })

      if (!criouUsuario) {
        return forbidden(new EmailInUseError())
      }

      const autenticacaoModel = await this.autenticacao.login({
        email,
        senha
      })

      return ok(autenticacaoModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace CadastroController {
	export type Request = {
		nome: string
		email: string
		senha: string
		confirmacaoSenha: string
	}
}
