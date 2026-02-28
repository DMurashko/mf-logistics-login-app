import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from 'ui_library/Button';
import { Input } from 'ui_library/Input';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useLoginMutation } from '../hooks/useLoginMutation';

export interface LoginPageProps {
  onLogin?: () => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useLoginMutation(onLogin);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Logistics Login
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Sign in to your logistics account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
          />

          {error && (
            <Typography variant="body2" color="error" textAlign="center">
              Login failed. Please check your credentials.
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 1 }}
            disabled={isPending}
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
