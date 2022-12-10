export const usuarioSchema = {
	type: 'object',
	properties: {
		accessToken: {
			type: 'string'
		},
		nome: {
			type: 'string'
		}
	},
	require: ['accessToken', 'nome']
}
