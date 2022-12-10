import { adaptMiddleware } from '@/main/adapters'
import { criarMiddlewareAutenticacao } from '@/main/factories/middlewares/auth-middleware-factory'

export const adminAuth = adaptMiddleware(criarMiddlewareAutenticacao('admin'))
