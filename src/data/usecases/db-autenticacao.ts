import { Autenticacao } from '@/domain/usecases'
import { HashComparer, Encrypter, BuscarUsuarioPorEmailRepository, AtualizarAccessTokenRepository } from '@/data/protocols'

export class DbAutenticao implements Autenticacao {
  constructor (
    private readonly buscarUsuarioPorEmailRepository: BuscarUsuarioPorEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly AtualizarAccessTokenRepository: AtualizarAccessTokenRepository
  ) { }

  async login (autenticao: Autenticacao.Params): Promise<Autenticacao.Result> {
    const account = await this.buscarUsuarioPorEmailRepository.buscarPorEmail(autenticao.email)
    if (account) {
      const senhaValida = await this.hashComparer.compare(autenticao.senha, account.senha)
      if (senhaValida) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.AtualizarAccessTokenRepository.atualizarAccessToken(account.id, accessToken)
        return {
          accessToken,
          nome: account.nome
        }
      }
    }

    return null
  }
}
