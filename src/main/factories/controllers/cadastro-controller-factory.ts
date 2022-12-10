import { Controller } from '@/presentation/protocols'
import { CadastroController } from '@/presentation/controllers'
import { criarDbAutenticacao, criarDbCriarUsuario } from '@/main/factories/usecases'
import { criarControllerDecorator } from '@/main/factories/decorator'
import { criarCadastroValidation } from '@/main/factories/controllers'

export const criarCadastroController = (): Controller => {
  const controller = new CadastroController(
		criarDbCriarUsuario(),
		criarCadastroValidation(),
		criarDbAutenticacao()
  )

  return criarControllerDecorator(controller)
}
