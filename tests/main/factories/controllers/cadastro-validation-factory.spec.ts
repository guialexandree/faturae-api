import { Validation } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { EmailValidation, ValidationComposite, CompareFieldsValidation, RequiredFieldValidation } from '@/validation/validators'
import { criarCadastroValidation } from '@/main/factories/controllers'

jest.mock('@/validation/validators/validation-composite')

describe('CadastroValidationFactory', () => {
  test('Deve chamar ValidationComposite com as validações corretas', () => {
    criarCadastroValidation()
    const validations: Validation[] = []
    for (const field of ['nome', 'email', 'senha', 'confirmacaoSenha']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('senha', 'confirmacaoSenha'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
