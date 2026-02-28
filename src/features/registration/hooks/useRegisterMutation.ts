/* eslint-disable @typescript-eslint/no-explicit-any */
import {useMutation} from '@tanstack/react-query';
import {authApi} from '../../../api/auth.ts';
import {AuthService} from '../../auth/AuthService';
import type {RegisterDto} from '../../../api/generated/models';

type AuthResponseDto = {
  accessToken: string;
  refreshToken: string;
};

export const useRegisterMutation = (onSuccessHandler?: () => void) => {
  return useMutation({
    mutationFn: (registerDto: RegisterDto) => authApi.register(registerDto),
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
