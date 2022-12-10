import { Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { criarDbBuscarUsuarioPorToken } from '@/main/factories/usecases'

export const criarMiddlewareAutenticacao = (role?: string): Middleware => {
	const buscarUsuarioPorToken = criarDbBuscarUsuarioPorToken()
  return new AuthMiddleware(buscarUsuarioPorToken, role)
}
