import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AuthService from '../services/auth.service';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = (): string => {
        if (!formData.username.trim()) return 'Username is required';
        if (!formData.email.trim()) return 'Email is required';
        if (!formData.firstName.trim()) return 'First name is required';
        if (!formData.lastName.trim()) return 'Last name is required';
        if (!formData.password) return 'Password is required';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        if (formData.password.length < 6) return 'Password must be at least 6 characters';
        if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Email is invalid';

        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setLoading(true);

        try {
            await AuthService.signup({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName
            });

            setSuccess(true);
            // Wait some time before navigating to login page
            setTimeout(() => {
                navigate('/login', { state: { registered: true } });
            }, 2000);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
                py: 4
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 600,
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
                        <PersonAddIcon fontSize="large" />
                    </Box>
                    <Typography component="h1" variant="h5" fontWeight="bold">
                        Create Account
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                name="firstName"
                                autoComplete="given-name"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={loading}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={loading}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            mt: 3,
                            mb: 2
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/login" variant="body2" color="primary">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>

                <Snackbar
                    open={success}
                    autoHideDuration={3000}
                    onClose={() => setSuccess(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success">
                        Registration successful! Redirecting to login...
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default Signup;
