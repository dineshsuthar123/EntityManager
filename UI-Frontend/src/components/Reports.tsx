import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { saveAs } from 'file-saver';
import http from '../services/http';
import { API_URLS } from '../config/api-config';

interface ReportsProps {
    userRoles?: string[];
}

// Base API URL for reports
const REPORTS_API = API_URLS.ENTITIES.replace('/entities', '/reports');

const Reports: React.FC<ReportsProps> = ({ userRoles = [] }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [reportTitle, setReportTitle] = useState('');
    const [generatedBy, setGeneratedBy] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const isAdmin = userRoles.includes('ROLE_ADMIN');
    const isModerator = userRoles.includes('ROLE_MODERATOR');

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const downloadReport = async (endpoint: string, filename: string, params: Record<string, unknown> = {}) => {
        try {
            setLoading(true);
            const response = await http.get(`${REPORTS_API}/${endpoint}`, {
                params,
                responseType: 'blob'
            });
            saveAs(new Blob([response.data], { type: 'application/pdf' }), filename);
            setSnackbar({
                open: true,
                message: 'Report downloaded successfully!',
                severity: 'success'
            });
        } catch (error: any) {
            console.error('Error downloading report:', error);
            let errorMessage = 'Failed to download report. Please try again.';
            if (error?.response?.status === 401) {
                errorMessage = 'Please sign in to download reports.';
            } else if (error?.response?.status === 403) {
                errorMessage = 'You do not have permission to download this report.';
            }
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEntityReportDownload = () => {
        downloadReport('entities', 'entities_report.pdf');
    };

    const handleCustomColumnsReportDownload = () => {
        downloadReport('custom-columns', 'custom_columns_report.pdf', {
            title: reportTitle || undefined,
            generatedBy: generatedBy || undefined
        });
    };

    const handleStatisticsReportDownload = () => {
        downloadReport('statistics', 'entity_statistics_report.pdf');
    };

    const handleDateRangeReportDownload = () => {
        if (!startDate || !endDate) {
            setSnackbar({
                open: true,
                message: 'Please select both start and end dates',
                severity: 'error'
            });
            return;
        }

        if (startDate > endDate) {
            setSnackbar({
                open: true,
                message: 'Start date must be before end date',
                severity: 'error'
            });
            return;
        }

        downloadReport('date-range', 'date_range_report.pdf', {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Reports
                </Typography>
                <Typography variant="body1" paragraph>
                    Generate various reports to analyze your data. Select one of the report types below.
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <FormatListBulletedIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
                                <Typography variant="h6">Entities Report</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Generate a complete list of all entities with their basic information.
                                This report includes ID, name, description, and creation date.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                onClick={handleEntityReportDownload}
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? <CircularProgress size={24} /> : 'Download Report'}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <DescriptionIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
                                <Typography variant="h6">Custom Columns Report</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Generate a report including all custom columns for each entity.
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        label="Report Title"
                                        value={reportTitle}
                                        onChange={(e) => setReportTitle(e.target.value)}
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        label="Generated By"
                                        value={generatedBy}
                                        onChange={(e) => setGeneratedBy(e.target.value)}
                                        fullWidth
                                        margin="dense"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                onClick={handleCustomColumnsReportDownload}
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? <CircularProgress size={24} /> : 'Download Report'}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {(isAdmin || isModerator) && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <AssessmentIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
                                    <Typography variant="h6">Statistics Report</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Generate a statistical analysis report of all entities and their custom columns.
                                    This report includes charts and summaries of your data.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    onClick={handleStatisticsReportDownload}
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Download Report'}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )}

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <DateRangeIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
                                <Typography variant="h6">Date Range Report</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Generate a report of entities created within a specific date range.
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        <DatePicker
                                            label="Start Date"
                                            value={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <DatePicker
                                            label="End Date"
                                            value={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        />
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                onClick={handleDateRangeReportDownload}
                                disabled={loading || !startDate || !endDate}
                                fullWidth
                            >
                                {loading ? <CircularProgress size={24} /> : 'Download Report'}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Reports;
