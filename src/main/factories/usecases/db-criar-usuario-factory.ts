import { CriarUsuario } from '@/domain/usecases'
import { DbCriarUsuario } from '@/data/usecases'
import { UsuarioMongoRepository } from '@/infra/db/mongodb'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'

export const criarDbCriarUsuario = (): CriarUsuario => {
  const bcryptAdapter = new BcryptAdapter()
  const accountMongoRepository = new UsuarioMongoRepository()

  return new DbCriarUsuario(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  )
}
