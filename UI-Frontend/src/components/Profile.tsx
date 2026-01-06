import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    Chip,
    Divider,
    Alert,
    Snackbar,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    Stack
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import AuthService from '../services/auth.service';
import http from '../services/http';
import { API_URLS } from '../config/api-config';

const Profile: React.FC = () => {
    const userInfo = AuthService.getCurrentUser();
    const [editing, setEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Form data
    const [formData, setFormData] = useState({
        firstName: userInfo?.firstName || '',
        lastName: userInfo?.lastName || '',
        email: userInfo?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password validation only if user is trying to change password
        if (formData.newPassword || formData.confirmPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required to change password';
            }
            if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'Password must be at least 6 characters';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Update profile - assuming there's an endpoint for this
            const updateData: Record<string, string> = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            await http.put(`${API_URLS.AUTH}/profile`, updateData);

            // Update local storage with new user info
            const currentUser = AuthService.getCurrentUser();
            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            setSnackbar({
                open: true,
                message: 'Profile updated successfully!',
                severity: 'success'
            });
            setEditing(false);

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setSnackbar({
                open: true,
                message: error?.response?.data?.message || 'Failed to update profile',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData({
            firstName: userInfo?.firstName || '',
            lastName: userInfo?.lastName || '',
            email: userInfo?.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    const getInitials = () => {
        const first = userInfo?.firstName?.charAt(0)?.toUpperCase() || '';
        const last = userInfo?.lastName?.charAt(0)?.toUpperCase() || '';
        return first + last || userInfo?.username?.charAt(0)?.toUpperCase() || 'U';
    };

    const getRoleColor = (role: string): 'error' | 'warning' | 'primary' => {
        switch (role) {
            case 'ROLE_ADMIN':
                return 'error';
            case 'ROLE_MODERATOR':
                return 'warning';
            default:
                return 'primary';
        }
    };

    const formatRoleName = (role: string) => {
        return role.replace('ROLE_', '').charAt(0) + role.replace('ROLE_', '').slice(1).toLowerCase();
    };

    if (!userInfo) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="warning">
                    Please log in to view your profile.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
            {/* Header Card */}
            <Paper sx={{ p: 4, mb: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        margin: 'auto',
                        mb: 2,
                        bgcolor: 'white',
                        color: 'primary.main',
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                    }}
                >
                    {getInitials()}
                </Avatar>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                    {userInfo.firstName} {userInfo.lastName}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    @{userInfo.username}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {userInfo.roles?.map((role: string) => (
                        <Chip
                            key={role}
                            label={formatRoleName(role)}
                            color={getRoleColor(role)}
                            size="small"
                            sx={{ color: 'white' }}
                        />
                    ))}
                </Box>
            </Paper>

            {/* Profile Details */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="primary" />
                            Profile Information
                        </Typography>
                        {!editing ? (
                            <Button
                                startIcon={<EditIcon />}
                                variant="outlined"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    startIcon={<CancelIcon />}
                                    variant="outlined"
                                    color="error"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                sx={{ flex: 1, minWidth: 200 }}
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={!editing}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                sx={{ flex: 1, minWidth: 200 }}
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={!editing}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!editing}
                            error={!!errors.email}
                            helperText={errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            value={userInfo.username}
                            disabled
                            helperText="Username cannot be changed"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>

                    {editing && (
                        <>
                            <Divider sx={{ my: 4 }} />
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <SecurityIcon color="primary" />
                                Change Password (Optional)
                            </Typography>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Current Password"
                                    name="currentPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    error={!!errors.currentPassword}
                                    helperText={errors.currentPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <TextField
                                        sx={{ flex: 1, minWidth: 200 }}
                                        label="New Password"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        edge="end"
                                                    >
                                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <TextField
                                        sx={{ flex: 1, minWidth: 200 }}
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                    />
                                </Box>
                            </Stack>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Account Info */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <SecurityIcon color="primary" />
                        Account Information
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Account ID
                            </Typography>
                            <Typography variant="body1">
                                {userInfo.id}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Roles
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                {userInfo.roles?.map((role: string) => (
                                    <Chip
                                        key={role}
                                        label={formatRoleName(role)}
                                        size="small"
                                        color={getRoleColor(role)}
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;
