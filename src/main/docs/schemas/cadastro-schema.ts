export const cadastroParamsSchema = {
	type: 'object',
	properties: {
		nome: {
			type: 'string'
		},
		email: {
			type: 'string'
		},
		senha: {
			type: 'string'
		},
		confirmacaoSenha: {
			type: 'string'
		}
	},
	required: ['nome', 'email', 'senha', 'confirmacaoSenha']
}
