import React, { useState, useEffect} from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSearchParams, Link } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const codeFromUrl = searchParams.get('token')

  const [email, setEmail] = useState('')
  const [otc, setOtc] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const handleToggle = () => {
    setShowPassword((prev) => !prev)
  }

  useEffect(() => {
    if (codeFromUrl) {
      setOtc(codeFromUrl)
    }
  }, [codeFromUrl])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !email || !otc || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    if (!isEmailValid) {
      setError('Invalid email address');
      return;
    }

    const isPasswordValid = 
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(newPassword)
    if (!isPasswordValid) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://api.wishify.ca/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otc, newPassword }),
      });

      if (response.status === 400) {
        setError('Invalid reset code or email. Please check and try again.');
        return;
      } else if (response.status === 401) {
        setError('All fields are required.');
        return;
      } else if (response.status === 500) {
        setError('A server error occurred. Please try again later.');
        return;
      } else if (!response.ok) {
        setError('An unexpected error occurred. Please try again later.');
        return;
      } else if (response.status === 200) {
        setSubmitted(true);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const style = {
    background: '#FFFFFF',
    border: '1px solid #5651E5',
    fontFamily: 'Arial, Helvetica, sans-serif',
    margin: '50px auto',
    padding: '50px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    maxWidth: '500px',
  }

  return (
    <section style={style}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Reset Your Password
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {codeFromUrl
            ? 'Choose a new password below.'
            : 'Enter the reset code from your email and choose a new password.'}
        </Typography>

        {submitted ? (
          <Alert severity="success">Your password has been reset! You can now{' '} 
            <Link 
              to="/login"
              style={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'underline' }}
            >
              login
            </Link>.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& label.Mui-focused': {
                  color: '#5651e5',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#5651e5',
                  },
                },
                mb: 2,
              }}
            />

            <TextField
              fullWidth
              label="Reset Code"
              variant="outlined"
              margin="normal"
              value={otc}
              onChange={(e) => setOtc(e.target.value)}
              sx={{
                '& label.Mui-focused': {
                  color: '#5651e5',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#5651e5',
                  },
                },
                mb: 2,
              }}
            />

            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggle}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& label.Mui-focused': {
                  color: '#5651e5',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#5651e5',
                  },
                },
                mb: 2,
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggle}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& label.Mui-focused': {
                  color: '#5651e5',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#5651e5',
                  },
                },
                mb: 2,
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained" 
              fullWidth type="submit" 
              sx={{
                mt: 2,
                background: 'linear-gradient(to right, #8d8aee, #5651e5)',
                color: 'white',
                borderRadius: '8px',
                transition: 'background 0.3s ease',
                padding: '12px',
                fontSize: '1rem',
                '&:hover': { background: 'linear-gradient(to right, #5651e5, #343188)' }
              }}
            >
              Reset Password
            </Button>
          </form>
        )}
      </Box>
    </section>
  );
}
