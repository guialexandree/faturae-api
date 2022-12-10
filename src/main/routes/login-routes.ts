import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { criarLoginController, criarCadastroController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.post('/cadastro', adaptRoute(criarCadastroController()))
  router.post('/login', adaptRoute(criarLoginController()))
}
