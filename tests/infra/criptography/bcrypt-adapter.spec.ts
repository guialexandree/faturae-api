import { throwError } from '@/tests/domain/mocks'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from '@/infra/criptography'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('any_hash')
  },
  async compare (): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

describe('Bcrypt Adapter', () => {
  const makeSut = (): BcryptAdapter => {
    const sut = new BcryptAdapter()
    return sut
  }

	describe('hash()', () => {
		test('Deve chamar hash com os valores corretos', async () => {
			const sut = makeSut()

			const hashSpy = jest.spyOn(bcrypt, 'hash')
			await sut.hash('any_value')

			expect(hashSpy).toHaveBeenCalledWith('any_value', sut.salt)
		})

		test('Deve retornar uma hash se o hasher ocorrer com sucesso', async () => {
			const sut = makeSut()

			const hash = await sut.hash('any_value')

			expect(hash).toBe('any_hash')
		})

		test('Deve progragar o erro se hash der erro', async () => {
			const sut = makeSut()
			const hashSpy =
				jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock<
				ReturnType<(key: string) => Promise<string>>,
				Parameters<(key: string) => Promise<string>>
				>
			hashSpy.mockImplementationOnce(throwError)

			const promise = sut.hash('any_value')

			await expect(promise).rejects.toThrow()
		})
	})

	describe('compare()', () => {
		test('Deve chamar compare com os valores corretos', async () => {
			const sut = makeSut()

			const compareSpy = jest.spyOn(bcrypt, 'compare')
			await sut.compare('any_value', 'any_hash')

			expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
		})

		test('Deve retornar true se compare ocorrer com sucesso', async () => {
			const sut = makeSut()

			const isValid = await sut.compare('any_value', 'any_hash')

			expect(isValid).toBe(true)
		})

		test('Deve progragar o erro se se a comparação der erro', async () => {
			const sut = makeSut()
			jest
				.spyOn(bcrypt, 'compare')
				.mockImplementationOnce(() => { throw new Error() })

			const promise = sut.compare('any_value', 'any_hash')

			await expect(promise).rejects.toThrow()
		})
	})
})
