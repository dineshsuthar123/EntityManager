import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Grid,
    Link as MuiLink,
    InputAdornment,
    IconButton,
    alpha,
    Stepper,
    Step,
    StepLabel,
    Fade
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AuthService from '../services/auth.service';
import { quantColors } from '../theme/quantTheme';

const steps = ['Personal Info', 'Account Details', 'Security'];

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 0:
                if (!formData.firstName.trim()) {
                    setError('First name is required');
                    return false;
                }
                if (!formData.lastName.trim()) {
                    setError('Last name is required');
                    return false;
                }
                return true;
            case 1:
                if (!formData.username.trim() || formData.username.length < 3) {
                    setError('Username must be at least 3 characters');
                    return false;
                }
                if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    setError('Please enter a valid email address');
                    return false;
                }
                return true;
            case 2:
                if (!formData.password || formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateStep(activeStep)) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await AuthService.signup({
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim()
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Fade in={activeStep === 0}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <PersonIcon sx={{ color: quantColors.accent.main }} />
                                <Typography variant="h6">Personal Information</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        name="firstName"
                                        autoComplete="given-name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={loading}
                                        autoFocus
                                        InputProps={{
                                            sx: {
                                                backgroundColor: alpha(quantColors.background.default, 0.5),
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={loading}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: alpha(quantColors.background.default, 0.5),
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                );
            case 1:
                return (
                    <Fade in={activeStep === 1}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <EmailIcon sx={{ color: quantColors.accent.main }} />
                                <Typography variant="h6">Account Details</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={loading}
                                        helperText="At least 3 characters"
                                        InputProps={{
                                            sx: {
                                                backgroundColor: alpha(quantColors.background.default, 0.5),
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
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
                                        InputProps={{
                                            sx: {
                                                backgroundColor: alpha(quantColors.background.default, 0.5),
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                );
            case 2:
                return (
                    <Fade in={activeStep === 2}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <LockIcon sx={{ color: quantColors.accent.main }} />
                                <Typography variant="h6">Secure Your Account</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        helperText="At least 6 characters"
                                        InputProps={{
                                            sx: {
                                                backgroundColor: alpha(quantColors.background.default, 0.5),
                                            },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        sx={{ color: quantColors.text.muted }}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={loading}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: alpha(quantColors.background.default, 0.5),
                                            },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle confirm password visibility"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                        sx={{ color: quantColors.text.muted }}
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>
                );
            default:
                return null;
        }
    };

    if (success) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: `linear-gradient(135deg, ${quantColors.background.default} 0%, ${quantColors.primary.light} 50%, ${quantColors.background.default} 100%)`,
                }}
            >
                <Paper
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        backgroundColor: alpha(quantColors.background.card, 0.9),
                        backdropFilter: 'blur(24px)',
                        border: `1px solid ${quantColors.border.default}`,
                        borderRadius: 4,
                        maxWidth: 400,
                    }}
                >
                    <CheckCircleIcon
                        sx={{
                            fontSize: 80,
                            color: quantColors.success,
                            mb: 3,
                        }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        Welcome Aboard!
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: quantColors.text.secondary, mb: 3 }}
                    >
                        Your account has been created successfully.
                        <br />
                        Redirecting to login...
                    </Typography>
                    <CircularProgress size={24} sx={{ color: quantColors.accent.main }} />
                </Paper>
            </Box>
        );
    }

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
            {/* Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: 350,
                    height: 350,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(quantColors.accent.main, 0.1)} 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '5%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(quantColors.gold.main, 0.08)} 0%, transparent 70%)`,
                    filter: 'blur(80px)',
                }}
            />

            {/* Left Panel - Branding */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', lg: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    p: 8,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Box sx={{ maxWidth: 500 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 4,
                            p: 2,
                            backgroundColor: alpha(quantColors.accent.main, 0.1),
                            borderRadius: 2,
                            width: 'fit-content',
                        }}
                    >
                        <RocketLaunchIcon sx={{ color: quantColors.accent.main, fontSize: 28 }} />
                        <Typography
                            variant="body1"
                            sx={{ color: quantColors.accent.main, fontWeight: 600 }}
                        >
                            Join 10,000+ data professionals
                        </Typography>
                    </Box>
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
                        Start Your
                        <br />
                        Data Journey
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: quantColors.text.secondary,
                            fontWeight: 400,
                            mb: 4,
                            lineHeight: 1.7,
                        }}
                    >
                        Create your account and unlock powerful entity management
                        capabilities with advanced analytics and real-time insights.
                    </Typography>

                    {/* Benefits */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[
                            'Unlimited entity management',
                            'Advanced data visualization',
                            'Real-time collaboration',
                            'Enterprise-grade security',
                        ].map((benefit, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    color: quantColors.text.secondary,
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{ color: quantColors.accent.main, fontSize: 20 }}
                                />
                                <Typography variant="body1">{benefit}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Right Panel - Signup Form */}
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
                        maxWidth: 500,
                        backgroundColor: alpha(quantColors.background.card, 0.8),
                        backdropFilter: 'blur(24px)',
                        border: `1px solid ${quantColors.border.default}`,
                        borderRadius: 4,
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Create Account
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: quantColors.text.secondary, mb: 4 }}
                    >
                        Fill in your details to get started
                    </Typography>

                    {/* Stepper */}
                    <Stepper
                        activeStep={activeStep}
                        sx={{
                            mb: 4,
                            '& .MuiStepLabel-label': {
                                color: quantColors.text.muted,
                                fontSize: '0.75rem',
                            },
                            '& .MuiStepLabel-label.Mui-active': {
                                color: quantColors.accent.main,
                            },
                            '& .MuiStepLabel-label.Mui-completed': {
                                color: quantColors.success,
                            },
                            '& .MuiStepIcon-root': {
                                color: quantColors.border.strong,
                            },
                            '& .MuiStepIcon-root.Mui-active': {
                                color: quantColors.accent.main,
                            },
                            '& .MuiStepIcon-root.Mui-completed': {
                                color: quantColors.success,
                            },
                        }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                backgroundColor: alpha(quantColors.error, 0.1),
                                border: `1px solid ${alpha(quantColors.error, 0.3)}`,
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        {getStepContent(activeStep)}

                        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                            {activeStep > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    disabled={loading}
                                    sx={{
                                        flex: 1,
                                        py: 1.5,
                                        borderColor: quantColors.border.strong,
                                        color: quantColors.text.secondary,
                                        '&:hover': {
                                            borderColor: quantColors.accent.main,
                                            color: quantColors.accent.main,
                                        },
                                    }}
                                >
                                    Back
                                </Button>
                            )}
                            {activeStep < steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={loading}
                                    sx={{
                                        flex: 1,
                                        py: 1.5,
                                        backgroundColor: quantColors.accent.main,
                                        color: quantColors.primary.main,
                                        '&:hover': {
                                            backgroundColor: quantColors.accent.light,
                                        },
                                    }}
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        flex: 1,
                                        py: 1.5,
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
                                        'Create Account'
                                    )}
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography variant="body2" sx={{ color: quantColors.text.secondary }}>
                                Already have an account?{' '}
                                <MuiLink
                                    component={Link}
                                    to="/login"
                                    underline="hover"
                                    sx={{
                                        color: quantColors.accent.main,
                                        fontWeight: 600,
                                        '&:hover': { color: quantColors.accent.light },
                                    }}
                                >
                                    Sign In
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Signup;
