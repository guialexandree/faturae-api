import { CriarUsuario, Autenticacao } from '@/domain/usecases'
import faker from 'faker'

export const mockCriarUsuarioParams = (): CriarUsuario.Params => ({
	nome: faker.name.findName(),
	email: faker.internet.email(),
	senha: faker.internet.password()
})

export const mockAutenticacaoParams = (): Autenticacao.Params => {
	return {
		email: faker.internet.email(),
		senha: faker.internet.password()
	}
}
