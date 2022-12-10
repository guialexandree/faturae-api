import { CriarUsuario } from '@/domain/usecases'
import { CriarUsuarioRepository, ValidarUsuarioPorEmailRepository, Hasher } from '@/data/protocols'

export class DbCriarUsuario implements CriarUsuario {
  constructor (
    private readonly hasher: Hasher,
    private readonly criarUsuarioRepository: CriarUsuarioRepository,
    private readonly validarUsuarioPorEmailRepository: ValidarUsuarioPorEmailRepository
  ) {}

  async criar (usuarioData: CriarUsuario.Params): Promise<CriarUsuario.Result> {
    const existeUsuarioEmail = await this.validarUsuarioPorEmailRepository.validarUsuario(usuarioData.email)
    let usuarioCriado = false
		if (!existeUsuarioEmail) {
      const senhaCriptograda = await this.hasher.hash(usuarioData.senha)
      usuarioCriado = await this
        .criarUsuarioRepository
        .salvar({ ...usuarioData, senha: senhaCriptograda })
		}
    return usuarioCriado
  }
}
