import {useMutation} from '@tanstack/react-query';
import {authApi} from '../../../api/auth.ts';
import {AuthService} from '../../auth/AuthService';
import {getErrorMessage, useNotification} from 'ui_library/NotificationContext';
import type {LoginDto} from '../../../api/generated/models';

export const useLoginMutation = (onSuccessHandler?: () => void) => {
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: (loginDto: LoginDto) => authApi.login(loginDto),
    onSuccess: (response) => {
      const data = response.data;
      if (data.accessToken && data.refreshToken) {
        AuthService.setTokens(data.accessToken, data.refreshToken);
      }
      showSuccess('Login successful! Redirecting...');
      if (onSuccessHandler) {
        onSuccessHandler();
      }
    },
    onError: (error: unknown) => {
      showError(getErrorMessage(error));
    },
  });
};
