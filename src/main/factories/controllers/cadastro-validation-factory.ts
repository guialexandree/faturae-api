import { Validation } from '@/presentation/protocols'
import { ValidationComposite, EmailValidation, CompareFieldsValidation, RequiredFieldValidation } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators'

export const criarCadastroValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['nome', 'email', 'senha', 'confirmacaoSenha']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('senha', 'confirmacaoSenha'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
