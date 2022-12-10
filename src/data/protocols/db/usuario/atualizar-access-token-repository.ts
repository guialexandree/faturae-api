export interface AtualizarAccessTokenRepository {
  atualizarAccessToken: (id: string, token: string) => Promise<void>
}
