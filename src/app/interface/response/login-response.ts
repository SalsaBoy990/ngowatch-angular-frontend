export interface LoginResponse {
  success: boolean,
  message?: string | null,
  result: null | { access_token: string, token_type: string, expires_at: string },
  error_code?: number
}
