import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email address is required');
      return;
    }

    try {
      const response = await fetch('https://api.wishify.ca/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.status === 401) {
        setSuccessMessage('Email address required');
        setSeverity('error');
        setOpenSuccessMessage(true);
        return;
      } else if (response.status === 404) {
        setSuccessMessage('No account with that email address found');
        setSeverity('error');
        setOpenSuccessMessage(true);
        return;
      } else if (response.status === 500) {
        setSuccessMessage('A server error occurred. Please try again later.');
        setSeverity('error');
        setOpenSuccessMessage(true);
        return;
      } else if (!response.ok) {
        setSuccessMessage('An unexpected error occurred. Please try again later.');
        setSeverity('error');
        setOpenSuccessMessage(true);
        return;
      } else if (response.status === 200) {
        setSubmitted(true);
        return;
      }


    } catch (err) {
      setSuccessMessage('An error occurred. Please try again later.');
      setSeverity('error');
      setOpenSuccessMessage(true);
      return;
    }
  };

  return (

    
    <Container maxWidth="sm">

      <Snackbar
        open={openSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setOpenSuccessMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSuccessMessage(false)} severity={severity} variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Forgot your password?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>

        {submitted ? (
          <Alert severity="success">
            Please check your inbox for password reset instructions.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
              Send Reset Link
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
}
