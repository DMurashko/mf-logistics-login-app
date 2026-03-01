export class InvalidRefreshTokenError extends Error {
  constructor(message = 'Refresh token is invalid or expired') {
    super(message);
    this.name = 'InvalidRefreshTokenError';
  }
}
