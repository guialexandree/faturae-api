import env from '@/main/config/env'
import { Autenticacao } from '@/domain/usecases'
import { DbAutenticao } from '@/data/usecases'
import { UsuarioMongoRepository } from '@/infra/db/mongodb'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'

export const criarDbAutenticacao = (): Autenticacao => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new UsuarioMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)

  return new DbAutenticao(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}
