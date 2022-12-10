import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers'
import { criarDbAutenticacao } from '@/main/factories/usecases'
import { criarLoginValidation } from '@/main/factories/controllers'
import { criarControllerDecorator } from '@/main/factories/decorator'

export const criarLoginController = (): Controller => {
  const controller = new LoginController(
    criarDbAutenticacao(),
    criarLoginValidation()
  )

  return criarControllerDecorator(controller)
}
