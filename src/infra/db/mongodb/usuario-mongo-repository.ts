import { CriarUsuario } from '@/domain/usecases'
import { CriarUsuarioRepository, ValidarUsuarioPorEmailRepository, BuscarUsuarioPorEmailRepository, BuscarUsuarioPorTokenRepository, AtualizarAccessTokenRepository } from '@/data/protocols/'
import { MongoHelper } from '@/infra/db/mongodb'
import { ObjectId } from 'mongodb'

export class UsuarioMongoRepository implements CriarUsuarioRepository, BuscarUsuarioPorEmailRepository, AtualizarAccessTokenRepository, BuscarUsuarioPorTokenRepository, ValidarUsuarioPorEmailRepository {
  async salvar (data: CriarUsuario.Params): Promise<CriarUsuarioRepository.Result> {
    const accountCollection = MongoHelper.getCollection('usuarios')
    const newAccount = await accountCollection.insertOne(data)
    return newAccount.insertedId !== null
  }

  async buscarPorEmail (email: string): Promise<BuscarUsuarioPorEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('usuarios')
    const result = await accountCollection.findOne({
			email
		}, {
			projection: {
				_id: 1,
				nome: 1,
				senha: 1
			}
		})
    return result && MongoHelper.map(result)
  }

	async validarUsuario (email: string): Promise<ValidarUsuarioPorEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('usuarios')
    const result = await accountCollection.findOne({
			email
		}, {
			projection: {
				_id: 1
			}
		})
    return !!result && MongoHelper.map(result).id !== null
  }

  async atualizarAccessToken (id: string, accessToken: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('usuarios')
    const objectId = new ObjectId(id)
    await accountCollection.updateOne({
      _id: objectId
    }, {
      $set: {
        accessToken
      }
    })
  }

	async buscarPorToken (token: string, perfil?: string): Promise<BuscarUsuarioPorTokenRepository.Result> {
		const accountCollection = MongoHelper.getCollection('usuarios')
    const result = await accountCollection.findOne({
			accessToken: token,
			$or: [{
				perfil
			}, {
				perfil: 'admin'
			}, {
				projection: {
					_id: 1
				}
			}]
		})
    return result && MongoHelper.map(result)
	}
}
