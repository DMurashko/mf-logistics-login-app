import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from 'ui_library/Button';
import { Input } from 'ui_library/Input';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useRegisterMutation } from '../hooks/useRegisterMutation';

export interface RegisterPageProps {
  onRegister?: () => void;
}

export const RegisterPage = ({ onRegister }: RegisterPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { mutate: register, isPending, error } = useRegisterMutation(onRegister);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    register({
      email,
      password,
      firstName,
      lastName,
    });
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
          Logistics Register
        </Typography>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Create an account to manage your logistics
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Input
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
            autoComplete="given-name"
          />

          <Input
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
            autoComplete="family-name"
          />

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
            autoComplete="new-password"
          />

          {error && (
            <Typography variant="body2" color="error" textAlign="center">
              Registration failed. Please try again.
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
            {isPending ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
