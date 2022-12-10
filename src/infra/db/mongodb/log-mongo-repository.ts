import { LogErrorRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
			app: 'Faturae - Backend',
      error: stack,
      date: new Date()
    })
  }
}