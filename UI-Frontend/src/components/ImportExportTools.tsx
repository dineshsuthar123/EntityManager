import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Typography,
    Divider,
    Paper,
    FormControl,
    FormLabel,
    Alert,
    IconButton,
    CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';
import { saveAs } from 'file-saver';
import AuthService from '../services/auth.service';
import { API_URLS } from '../config/api-config';

const baseApiUrl = API_URLS.IMPORT_EXPORT;

const ImportExportTools: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importFormat, setImportFormat] = useState<'csv' | 'excel'>('excel');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, severity: 'success' | 'error' | 'info' }>({ text: '', severity: 'info' });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);

            // Auto-detect format based on file extension
            if (file.name.toLowerCase().endsWith('.csv')) {
                setImportFormat('csv');
            } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
                setImportFormat('excel');
            }
        }
    }; const exportData = async (format: 'csv' | 'excel') => {
        try {
            setLoading(true);
            const token = AuthService.getAccessToken();

            const response = await axios.get(`${baseApiUrl}/export/${format}`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const blob = new Blob([response.data], {
                type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            saveAs(blob, format === 'csv' ? `entities_${new Date().toISOString()}.csv` : `entities_${new Date().toISOString()}.xlsx`);

            setMessage({
                text: `Successfully exported data as ${format.toUpperCase()}`,
                severity: 'success'
            });
        } catch (error) {
            console.error('Export error:', error);
            setMessage({
                text: `Error exporting data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }; const importData = async () => {
        if (!selectedFile) {
            setMessage({ text: 'Please select a file to import', severity: 'error' });
            return;
        }

        try {
            setLoading(true);
            const token = AuthService.getAccessToken();

            const formData = new FormData();
            formData.append('file', selectedFile);

            const endpoint = importFormat === 'csv' ? 'import/csv' : 'import/excel';

            const response = await axios.post(`${baseApiUrl}/${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessage({
                text: response.data.message || 'Data imported successfully',
                severity: 'success'
            });

            // Reset the file selection
            setSelectedFile(null);

            // Trigger page refresh to show the imported data
            window.location.reload();
        } catch (error) {
            console.error('Import error:', error);
            let errorMessage = 'Failed to import data';

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setMessage({ text: errorMessage, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const resetMessage = () => {
        setMessage({ text: '', severity: 'info' });
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Import/Export Tools
            </Typography>

            <Divider sx={{ my: 2 }} />

            {message.text && (
                <Alert
                    severity={message.severity}
                    sx={{ mb: 2 }}
                    action={
                        <IconButton
                            color="inherit"
                            size="small"
                            onClick={resetMessage}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Export Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Export Data
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Download all entities in your preferred format.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={() => exportData('excel')}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Export Excel'}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => exportData('csv')}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Export CSV'}
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Import Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Import Data
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Upload a CSV or Excel file to import entities.
                        </Typography>

                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                            <FormLabel component="legend">Select File</FormLabel>
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <input
                                    accept=".csv,.xlsx,.xls"
                                    style={{ display: 'none' }}
                                    id="contained-button-file"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<UploadIcon />}
                                    >
                                        Choose File
                                    </Button>
                                </label>
                                {selectedFile && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Selected: {selectedFile.name}
                                    </Typography>
                                )}
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FileUploadIcon />}
                                onClick={importData}
                                disabled={!selectedFile || loading}
                                sx={{ mt: 1 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Import Data'}
                            </Button>
                        </FormControl>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ImportExportTools;
