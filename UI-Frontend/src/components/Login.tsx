import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    Snackbar,
    Grid,
    CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AuthService from '../services/auth.service';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Get redirect location from state, default to home page
    const from = (location.state as any)?.from?.pathname || '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await AuthService.login({ username, password });
            setSnackbarOpen(true);

            // Navigate after a brief delay to show success message
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1000);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 450,
                    width: '100%',
                    borderRadius: 2,
                    mx: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 3
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            p: 2,
                            borderRadius: '50%',
                            mb: 2
                        }}
                    >
                        <LockOutlinedIcon fontSize="large" />
                    </Box>
                    <Typography component="h1" variant="h5" fontWeight="bold">
                        Sign in
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            mb: 2
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Link component={RouterLink} to="/signup" variant="body2" color="primary">
                                Don't have an account? Sign up
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="#" variant="body2" color="primary">
                                Forgot password?
                            </Link>
                        </Grid>
                    </Grid>
                </Box>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success">Login successful! Redirecting...</Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default Login;
