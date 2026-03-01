import type {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig,} from 'axios';
import {AuthService} from '../features/auth/AuthService.ts';
import {InvalidRefreshTokenError} from './InvalidRefreshTokenError.ts';
import {authApi} from "./auth.ts";

type QueuedRequest = {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
};

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

export interface IRefreshService {
  interceptReq(): void;
  interceptRes(): void;
}

export class RefreshTokenService implements IRefreshService {
  private static instance: RefreshTokenService | null = null;

  private requestsQueue: QueuedRequest[] = [];
  private isRefreshing = false;
  private requestInterceptorId: number | null = null;
  private responseInterceptorId: number | null = null;

  constructor(private readonly axiosInstance: AxiosInstance) {
    this.interceptReq();
    this.interceptRes();
  }

  static initialize(axiosInstance: AxiosInstance): RefreshTokenService {
    if (!RefreshTokenService.instance) {
      RefreshTokenService.instance = new RefreshTokenService(axiosInstance);
    }
    return RefreshTokenService.instance;
  }

  static getInstance(): RefreshTokenService | null {
    return RefreshTokenService.instance;
  }

  interceptReq(): void {
    if (this.requestInterceptorId !== null) {
      this.axiosInstance.interceptors.request.eject(this.requestInterceptorId);
    }

    this.requestInterceptorId = this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = AuthService.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  interceptRes(): void {
    if (this.responseInterceptorId !== null) {
      this.axiosInstance.interceptors.response.eject(this.responseInterceptorId);
    }

    this.responseInterceptorId = this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error instanceof InvalidRefreshTokenError) {
          this.handleRefreshFailure();
          return Promise.reject(error);
        }

        const originalRequest = error.config as RetryableRequest;

        if (!originalRequest) {
          return Promise.reject(error);
        }

        const isAuthRequest =
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/register');

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthRequest
        ) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.requestsQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newTokens = await this.refreshAccessToken();
            this.processQueue(null, newTokens.accessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            }

            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.handleRefreshFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        if (error.response?.status === 401 && isAuthRequest) {
          return Promise.reject(error);
        }

        return Promise.reject(error);
      },
    );
  }

  destroy(): void {
    if (this.requestInterceptorId !== null) {
      this.axiosInstance.interceptors.request.eject(this.requestInterceptorId);
      this.requestInterceptorId = null;
    }
    if (this.responseInterceptorId !== null) {
      this.axiosInstance.interceptors.response.eject(this.responseInterceptorId);
      this.responseInterceptorId = null;
    }
    this.requestsQueue = [];
    this.isRefreshing = false;
    RefreshTokenService.instance = null;
  }

  private async refreshAccessToken(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const refreshToken = AuthService.getRefreshToken();
    if (!refreshToken) {
      throw new InvalidRefreshTokenError('No refresh token available');
    }

    try {
      const response = await authApi.refresh({ refreshToken });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      if (!accessToken || !newRefreshToken) {
        throw new InvalidRefreshTokenError('Invalid token response');
      }

      AuthService.setTokens(accessToken, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      AuthService.clearTokens();

      if (
        error instanceof InvalidRefreshTokenError
      ) {
        throw error;
      }

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as AxiosError).response?.status === 401
      ) {
        throw new InvalidRefreshTokenError(
          'Refresh token is invalid or expired',
        );
      }

      throw error;
    }
  }

  private processQueue(error: unknown, token: string | null): void {
    this.requestsQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else {
        if (config.headers && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        resolve(this.axiosInstance(config));
      }
    });

    this.requestsQueue = [];
  }

  private handleRefreshFailure(): void {
    AuthService.clearTokens();

    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }
}
