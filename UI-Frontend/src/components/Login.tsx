import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Link as MuiLink,
    InputAdornment,
    IconButton,
    alpha
} from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SecurityIcon from '@mui/icons-material/Security';
import AuthService from '../services/auth.service';
import { quantColors } from '../theme/quantTheme';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.username.trim() || !formData.password) {
            setError('Please enter both username and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await AuthService.login(formData.username.trim(), formData.password);
            navigate(from, { replace: true });
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Invalid username or password';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const features = [
        { icon: <TrendingUpIcon />, text: 'Real-time Entity Analytics' },
        { icon: <ShowChartIcon />, text: 'Advanced Data Visualization' },
        { icon: <SecurityIcon />, text: 'Enterprise-grade Security' },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                background: `linear-gradient(135deg, ${quantColors.background.default} 0%, ${quantColors.primary.light} 50%, ${quantColors.background.default} 100%)`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(quantColors.accent.main, 0.1)} 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    animation: 'pulse 4s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
                        '50%': { opacity: 0.8, transform: 'scale(1.1)' },
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '10%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(quantColors.gold.main, 0.08)} 0%, transparent 70%)`,
                    filter: 'blur(80px)',
                    animation: 'pulse2 5s ease-in-out infinite',
                    '@keyframes pulse2': {
                        '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
                        '50%': { opacity: 0.7, transform: 'scale(1.15)' },
                    },
                }}
            />

            {/* Left Panel - Branding */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    p: 8,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Box sx={{ maxWidth: 500 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: quantColors.accent.main,
                            letterSpacing: '0.2em',
                            mb: 2,
                            display: 'block',
                        }}
                    >
                        ENTITY MANAGEMENT PLATFORM
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            background: `linear-gradient(135deg, ${quantColors.text.primary} 0%, ${quantColors.accent.main} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1.2,
                        }}
                    >
                        Quantitative Data
                        <br />
                        Intelligence
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: quantColors.text.secondary,
                            fontWeight: 400,
                            mb: 6,
                            lineHeight: 1.7,
                        }}
                    >
                        Advanced entity management with sophisticated analytics,
                        real-time data processing, and enterprise-grade security.
                    </Typography>

                    {/* Feature List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {features.map((feature, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    color: quantColors.text.secondary,
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        backgroundColor: alpha(quantColors.accent.main, 0.1),
                                        color: quantColors.accent.main,
                                        display: 'flex',
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Typography variant="body1">{feature.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Right Panel - Login Form */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        width: '100%',
                        maxWidth: 440,
                        backgroundColor: alpha(quantColors.background.card, 0.8),
                        backdropFilter: 'blur(24px)',
                        border: `1px solid ${quantColors.border.default}`,
                        borderRadius: 4,
                    }}
                >
                    {/* Logo / Brand for mobile */}
                    <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: quantColors.accent.main,
                            }}
                        >
                            Entity Manager
                        </Typography>
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: quantColors.text.secondary, mb: 4 }}
                    >
                        Sign in to access your dashboard
                    </Typography>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                backgroundColor: alpha(quantColors.error, 0.1),
                                border: `1px solid ${alpha(quantColors.error, 0.3)}`,
                                '& .MuiAlert-icon': { color: quantColors.error },
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading}
                            sx={{ mb: 3 }}
                            InputProps={{
                                sx: {
                                    backgroundColor: alpha(quantColors.background.default, 0.5),
                                    '&:hover': {
                                        backgroundColor: alpha(quantColors.background.default, 0.7),
                                    },
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            sx={{ mb: 4 }}
                            InputProps={{
                                sx: {
                                    backgroundColor: alpha(quantColors.background.default, 0.5),
                                    '&:hover': {
                                        backgroundColor: alpha(quantColors.background.default, 0.7),
                                    },
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{ color: quantColors.text.muted }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            size="large"
                            sx={{
                                py: 1.5,
                                mb: 3,
                                fontSize: '1rem',
                                fontWeight: 600,
                                backgroundColor: quantColors.accent.main,
                                color: quantColors.primary.main,
                                boxShadow: `0 4px 20px ${alpha(quantColors.accent.main, 0.4)}`,
                                '&:hover': {
                                    backgroundColor: quantColors.accent.light,
                                    boxShadow: `0 6px 24px ${alpha(quantColors.accent.main, 0.5)}`,
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: quantColors.primary.main }} />
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: quantColors.text.secondary }}>
                                Don't have an account?{' '}
                                <MuiLink
                                    component={Link}
                                    to="/signup"
                                    underline="hover"
                                    sx={{
                                        color: quantColors.accent.main,
                                        fontWeight: 600,
                                        '&:hover': { color: quantColors.accent.light },
                                    }}
                                >
                                    Create Account
                                </MuiLink>
                            </Typography>
                        </Box>

                        {/* Demo credentials */}
                        <Box
                            sx={{
                                mt: 4,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: alpha(quantColors.info, 0.08),
                                border: `1px solid ${alpha(quantColors.info, 0.2)}`,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: quantColors.info,
                                    fontWeight: 600,
                                    display: 'block',
                                    mb: 1,
                                }}
                            >
                                DEMO CREDENTIALS
                            </Typography>
                            <Typography variant="body2" sx={{ color: quantColors.text.secondary }}>
                                Username: <strong style={{ color: quantColors.text.primary }}>admin</strong>
                                <br />
                                Password: <strong style={{ color: quantColors.text.primary }}>admin123</strong>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
