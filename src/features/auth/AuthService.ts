import {StorageKey} from './StorageKey';

export class AuthService {
  static get isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(StorageKey.ACCESS_TOKEN);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(StorageKey.REFRESH_TOKEN);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(StorageKey.ACCESS_TOKEN, accessToken);
    localStorage.setItem(StorageKey.REFRESH_TOKEN, refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(StorageKey.ACCESS_TOKEN);
    localStorage.removeItem(StorageKey.REFRESH_TOKEN);
  }
}
