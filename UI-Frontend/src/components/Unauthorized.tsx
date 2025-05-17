import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

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
                    maxWidth: 500,
                    width: '100%',
                    borderRadius: 2,
                    textAlign: 'center',
                    mx: 2
                }}
            >
                <BlockIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />

                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Access Denied
                </Typography>

                <Typography variant="body1" paragraph>
                    You don't have permission to access this page. Please contact your administrator
                    if you believe this is an error.
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/')}
                    >
                        Go to Home
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Unauthorized;
