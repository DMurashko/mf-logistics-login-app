/* eslint-disable @typescript-eslint/no-explicit-any */
import {useMutation} from '@tanstack/react-query';
import {authApi} from '../../../api/auth.ts';
import {AuthService} from '../../auth/AuthService';
import type {LoginDto} from '../../../api/generated/models';

type AuthResponseDto = {
  accessToken: string;
  refreshToken: string;
};

export const useLoginMutation = (onSuccessHandler?: () => void) => {
  return useMutation({
    mutationFn: (loginDto: LoginDto) => authApi.login(loginDto),
    onSuccess: (response: any) => {
      const data = response.data as AuthResponseDto;
      if (data.accessToken && data.refreshToken) {
        AuthService.setTokens(data.accessToken, data.refreshToken);
      }
      if (onSuccessHandler) {
        onSuccessHandler();
      }
    },
  });
};
