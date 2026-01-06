import React, { useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    alpha
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import type { MyEntityDTO } from '../types/MyEntityDTO';
import ImportExportTools from './ImportExportTools';
import { quantColors } from '../theme/quantTheme';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface DashboardProps {
    entities: MyEntityDTO[];
    isLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ entities, isLoading }) => {
    const [timeFilter, setTimeFilter] = useState('all');
    const [customColumnStats, setCustomColumnStats] = useState<{
        columnName: string;
        valueCount: Record<string, number>;
    }[]>([]);
    const [pieChartData, setPieChartData] = useState({
        labels: [] as string[],
        datasets: [
            {
                label: '',
                data: [] as number[],
                backgroundColor: [
                    alpha(quantColors.accent.main, 0.7),
                    alpha(quantColors.gold.main, 0.7),
                    alpha(quantColors.info, 0.7),
                    alpha(quantColors.success, 0.7),
                    alpha(quantColors.warning, 0.7),
                    alpha(quantColors.error, 0.7),
                ]
            }
        ]
    });

    useEffect(() => {
        // Process data for custom columns statistics
        const customColumnNames = new Set<string>();
        entities.forEach(entity => {
            entity.customColumns?.forEach(col => {
                if (col.name) customColumnNames.add(col.name);
            });
        });

        const stats = Array.from(customColumnNames).map(columnName => {
            const valueCount: Record<string, number> = {};

            entities.forEach(entity => {
                const column = entity.customColumns?.find(col => col.name === columnName);
                if (column && column.value) {
                    valueCount[column.value] = (valueCount[column.value] || 0) + 1;
                }
            });

            return { columnName, valueCount };
        });

        setCustomColumnStats(stats);
    }, [entities]);

    // Filter entities based on the time filter
    const getFilteredEntities = () => {
        if (timeFilter === 'all') return entities;

        const now = new Date();
        const filterDate = new Date();

        switch (timeFilter) {
            case 'today':
                filterDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                filterDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                filterDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                filterDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return entities;
        }

        return entities.filter(entity => {
            const createdDate = entity.createdDate ? new Date(entity.createdDate) : null;
            return createdDate && createdDate >= filterDate;
        });
    };    // Get creation date statistics for the line chart
    const getCreationStats = () => {
        const filteredEntities = getFilteredEntities();
        const dateMap: Record<string, number> = {};

        // Generate empty date slots for the selected time filter
        const now = new Date();

        if (timeFilter === 'today') {
            // Generate hourly slots for today
            for (let i = 0; i < 24; i++) {
                dateMap[`${i}:00`] = 0;
            }
        } else if (timeFilter === 'week') {
            // Generate slots for last 7 days
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = now.getDay();
            for (let i = 0; i < 7; i++) {
                const dayIndex = (today - i + 7) % 7;
                dateMap[days[dayIndex]] = 0;
            }
        } else if (timeFilter === 'month') {
            // Generate slots for last 30 days
            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(now.getDate() - i);
                dateMap[`${date.getMonth() + 1}/${date.getDate()}`] = 0;
            }
        } else if (timeFilter === 'year') {
            // Generate monthly slots for the year
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let i = 0; i < 12; i++) {
                dateMap[months[i]] = 0;
            }
        }

        // Fill in actual data
        filteredEntities.forEach(entity => {
            if (entity.createdDate) {
                const date = new Date(entity.createdDate);
                let dateKey;

                if (timeFilter === 'today') {
                    dateKey = `${date.getHours()}:00`;
                } else if (timeFilter === 'week') {
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    dateKey = days[date.getDay()];
                } else if (timeFilter === 'month') {
                    dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
                } else if (timeFilter === 'year') {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    dateKey = months[date.getMonth()];
                } else {
                    dateKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
                }

                dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
            }
        });

        // Sort the dates appropriately based on the time filter
        let sortedDates: string[];

        if (timeFilter === 'today') {
            sortedDates = Object.keys(dateMap).sort((a, b) => parseInt(a) - parseInt(b));
        } else if (timeFilter === 'week') {
            const dayOrder = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
            sortedDates = Object.keys(dateMap).sort((a, b) => dayOrder[a as keyof typeof dayOrder] - dayOrder[b as keyof typeof dayOrder]);
        } else if (timeFilter === 'year') {
            const monthOrder = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
            sortedDates = Object.keys(dateMap).sort((a, b) => monthOrder[a as keyof typeof monthOrder] - monthOrder[b as keyof typeof monthOrder]);
        } else {
            // For month view, sort by date
            sortedDates = Object.keys(dateMap).sort((a, b) => {
                const [aMonth, aDate] = a.split('/').map(Number);
                const [bMonth, bDate] = b.split('/').map(Number);
                if (aMonth !== bMonth) return aMonth - bMonth;
                return aDate - bDate;
            });
        }

        return {
            labels: sortedDates,
            data: sortedDates.map(date => dateMap[date])
        };
    };

    const creationStats = getCreationStats();
    const filteredEntities = getFilteredEntities();

    // Charts data
    const lineChartData = {
        labels: creationStats.labels,
        datasets: [
            {
                label: 'Created Entities',
                data: creationStats.data,
                borderColor: quantColors.accent.main,
                backgroundColor: alpha(quantColors.accent.main, 0.3),
                tension: 0.4,
                fill: true
            }
        ]
    };    // Update pie chart data when custom column stats change
    useEffect(() => {
        if (customColumnStats.length > 0) {
            setPieChartData({
                labels: Object.keys(customColumnStats[0].valueCount),
                datasets: [
                    {
                        label: customColumnStats[0].columnName,
                        data: Object.values(customColumnStats[0].valueCount),
                        backgroundColor: [
                            alpha(quantColors.accent.main, 0.7),
                            alpha(quantColors.gold.main, 0.7),
                            alpha(quantColors.info, 0.7),
                            alpha(quantColors.success, 0.7),
                            alpha(quantColors.warning, 0.7),
                            alpha(quantColors.error, 0.7),
                        ]
                    }
                ]
            });
        } else {
            setPieChartData({
                labels: ['No Data'],
                datasets: [{
                    label: 'No Data',
                    data: [1],
                    backgroundColor: [quantColors.border.strong]
                }]
            });
        }
    }, [customColumnStats]);

    // Loading state
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    } return (
        <Box sx={{ mb: 4 }}>
            {/* Import/Export Tools Component */}
            <ImportExportTools />

            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3, 
                    mb: 4, 
                    mt: 4, 
                    borderRadius: 3,
                    backgroundColor: quantColors.background.card,
                    border: `1px solid ${quantColors.border.subtle}`,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight={600}>Dashboard Analytics</Typography>
                    <FormControl size="small" sx={{ width: 150 }}>
                        <InputLabel>Time Period</InputLabel>
                        <Select
                            value={timeFilter}
                            label="Time Period"
                            onChange={(e) => setTimeFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Time</MenuItem>
                            <MenuItem value="today">Today</MenuItem>
                            <MenuItem value="week">Last 7 Days</MenuItem>
                            <MenuItem value="month">Last 30 Days</MenuItem>
                            <MenuItem value="year">Last Year</MenuItem>
                        </Select>
                    </FormControl>
                </Box>                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card
                            sx={{
                                backgroundColor: alpha(quantColors.accent.main, 0.1),
                                border: `1px solid ${alpha(quantColors.accent.main, 0.3)}`,
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 8px 24px ${alpha(quantColors.accent.main, 0.2)}`
                                }
                            }}
                        >
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Total Entries</Typography>
                                <Typography variant="h4" fontWeight="bold">{filteredEntities.length}</Typography>
                                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                                    {timeFilter !== 'all' ? `During ${timeFilter} timeframe` : 'All time'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card
                            sx={{
                                bgcolor: 'secondary.light',
                                color: 'secondary.contrastText',
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }
                            }}
                        >
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Custom Fields</Typography>
                                <Typography variant="h4" fontWeight="bold">{customColumnStats.length}</Typography>
                                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                                    {customColumnStats.length > 0
                                        ? `Most used: ${customColumnStats[0].columnName}`
                                        : 'No custom fields used'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card
                            sx={{
                                bgcolor: 'success.light',
                                color: 'success.contrastText',
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }
                            }}
                        >
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Created Today</Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {
                                        entities.filter(entity => {
                                            if (!entity.createdDate) return false;
                                            const today = new Date();
                                            const createdDate = new Date(entity.createdDate);
                                            return createdDate.toDateString() === today.toDateString();
                                        }).length
                                    }
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                                    {Math.max(0, new Date().getHours() - 9)} hours of activity
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card
                            sx={{
                                bgcolor: 'info.light',
                                color: 'info.contrastText',
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }
                            }}
                        >
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Modified Today</Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {
                                        entities.filter(entity => {
                                            if (!entity.lastModifiedDate) return false;
                                            const today = new Date();
                                            const modifiedDate = new Date(entity.lastModifiedDate);
                                            return modifiedDate.toDateString() === today.toDateString();
                                        }).length
                                    }
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                                    Most recent: {entities.length > 0 && entities[0].lastModifiedDate ?
                                        new Date(entities[0].lastModifiedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                        'N/A'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Entity Creation Over Time</Typography>
                        <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {creationStats.labels.length > 0 ? (
                                <Line
                                    data={lineChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: false
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <Typography color="text.secondary">No time-based data available</Typography>
                            )}
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {customColumnStats.length > 0 ?
                                `${customColumnStats[0].columnName} Distribution` :
                                'Custom Column Distribution'
                            }
                        </Typography>
                        <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>                            {customColumnStats.length > 0 && Object.keys(customColumnStats[0].valueCount).length > 0 ? (
                            <Pie
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 15
                                            }
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    const label = context.label || '';
                                                    const value = context.raw || 0;
                                                    const dataset = context.dataset;
                                                    const total = dataset.data.reduce((acc: number, data: number) => acc + data, 0);
                                                    const percentage = Math.round((value as number / total) * 100);
                                                    return `${label}: ${value} (${percentage}%)`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <Typography color="text.secondary">No custom column data available</Typography>
                        )}{customColumnStats.length > 1 && (
                            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                                <InputLabel>Column</InputLabel>
                                <Select
                                    label="Column"
                                    value={0}
                                    onChange={(e) => {
                                        const selectedIndex = e.target.value as number;
                                        const selectedStat = customColumnStats[selectedIndex];

                                        // Update the pie chart data
                                        const newPieChartData = {
                                            labels: Object.keys(selectedStat.valueCount),
                                            datasets: [
                                                {
                                                    label: selectedStat.columnName,
                                                    data: Object.values(selectedStat.valueCount),
                                                    backgroundColor: [
                                                        'rgba(255, 99, 132, 0.5)',
                                                        'rgba(54, 162, 235, 0.5)',
                                                        'rgba(255, 206, 86, 0.5)',
                                                        'rgba(75, 192, 192, 0.5)',
                                                        'rgba(153, 102, 255, 0.5)',
                                                        'rgba(255, 159, 64, 0.5)',
                                                    ]
                                                }
                                            ]
                                        };

                                        // Update state with the new chart data
                                        setPieChartData(newPieChartData);
                                    }}
                                >
                                    {customColumnStats.map((stat, index) => (
                                        <MenuItem key={stat.columnName} value={index}>
                                            {stat.columnName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Dashboard;
