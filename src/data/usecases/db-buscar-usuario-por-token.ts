import { BuscarUsuarioPorToken } from '@/domain/usecases'
import { Decrypter, BuscarUsuarioPorTokenRepository } from '@/data/protocols'

export class DbBuscarUsuarioPorToken implements BuscarUsuarioPorToken {
	constructor (
		private readonly decrypterStub: Decrypter,
		private readonly buscarUsuarioPorTokenRepository: BuscarUsuarioPorTokenRepository
	) {}

	async buscar (accessToken: string, perfil?: string): Promise<BuscarUsuarioPorToken.Result> {
		let token: string
		try {
			token = await this.decrypterStub.decrypt(accessToken)
		} catch (error) {
			return null
		}
		if (token) {
			const account = await this.buscarUsuarioPorTokenRepository.buscarPorToken(accessToken, perfil)
			if (account) {
				return account
			}
		}
		return null
	}
}
