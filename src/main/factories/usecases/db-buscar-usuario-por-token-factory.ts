import env from '@/main/config/env'
import { BuscarUsuarioPorToken } from '@/domain/usecases'
import { DbBuscarUsuarioPorToken } from '@/data/usecases'
import { UsuarioMongoRepository } from '@/infra/db/mongodb'
import { JwtAdapter } from '@/infra/criptography'

export const criarDbBuscarUsuarioPorToken = (): BuscarUsuarioPorToken => {
	const jwtAdapter = new JwtAdapter(env.jwtSecret)
	const usuarioMongoRepository = new UsuarioMongoRepository()

  return new DbBuscarUsuarioPorToken(
		jwtAdapter,
		usuarioMongoRepository
	)
}
