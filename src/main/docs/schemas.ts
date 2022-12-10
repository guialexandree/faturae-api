import {
	loginParamsSchema,
	usuarioSchema,
	errorSchema,
	cadastroParamsSchema
} from './schemas/'

export default {
	usuario: usuarioSchema,
	loginParams: loginParamsSchema,
	error: errorSchema,
	cadastroParams: cadastroParamsSchema
}
