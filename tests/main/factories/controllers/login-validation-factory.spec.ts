import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { Validation } from '@/presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { criarLoginValidation } from '@/main/factories/controllers'

jest.mock('@/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Deve chamar o ValidationComposite com as validações corretas', () => {
    criarLoginValidation()
    const validations: Validation[] = []

    for (const field of ['email', 'senha']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
