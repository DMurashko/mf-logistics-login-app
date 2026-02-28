declare module 'ui_library/Button' {
  import type { ButtonProps as MuiButtonProps } from '@mui/material';

  export interface ButtonProps
    extends Omit<MuiButtonProps, 'color'> {
    color?:
      | 'primary'
      | 'secondary'
      | 'inherit'
      | 'success'
      | 'error'
      | 'info'
      | 'warning';
  }

  export const Button: React.FC<ButtonProps>;
}

declare module 'ui_library/Input' {
  import type { TextFieldProps } from '@mui/material';

  export type InputProps = TextFieldProps;
  export const Input: React.FC<InputProps>;
}

declare module 'ui_library/Theme' {
  import type { Theme } from '@mui/material';

  export interface ThemeProviderProps {
    children: React.ReactNode;
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export const theme: Theme;
}

declare module 'ui_library/NotificationContext' {
  export const NotificationProvider: React.FC<{ children: React.ReactNode }>;
  export function useNotification(): {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
  };
  export function getErrorMessage(error: unknown): string;
}
