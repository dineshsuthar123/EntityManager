import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Dialog, DialogContent, Snackbar, Alert, Paper, Grid, Card, CardContent } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import GroupIcon from '@mui/icons-material/Group';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import MyEntityList from './components/MyEntityList';
import MyEntityForm from './components/MyEntityForm';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import AdvancedSearch from './components/AdvancedSearch';
import ImportExportTools from './components/ImportExportTools';
import Login from './components/Login';
import GridItem from './components/utils/GridItem';
import Signup from './components/Signup';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import type { MyEntityDTO } from './types/MyEntityDTO';
import { CustomColumnType } from './types/MyEntityDTO';
import AuthService from './services/auth.service';
import axios from 'axios';
import { API_URLS } from './config/api-config';

const API_URL = API_URLS.ENTITIES;

const App: React.FC = () => {
  const [entities, setEntities] = useState<MyEntityDTO[]>([]);
  const [selected, setSelected] = useState<MyEntityDTO | null>(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // Get user roles from authentication service
  const userRoles = AuthService.getRoles();

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const res = await axios.get<MyEntityDTO[]>(API_URL);
      setEntities(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch entities', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();

    // Add event listener for custom close dialog event
    const handleCloseDialog = () => setOpen(false);
    document.addEventListener('closeDialog', handleCloseDialog);

    // Add event listener for custom columns change event
    const handleCustomColumnsChanged = (event: Event) => {
      if (selected && 'detail' in event && (event as CustomEvent).detail?.customColumns) {
        const customColumns = (event as CustomEvent).detail.customColumns;
        setSelected(prev => prev ? { ...prev, customColumns } : prev);
      }
    };
    document.addEventListener('customColumnsChanged', handleCustomColumnsChanged);

    return () => {
      document.removeEventListener('closeDialog', handleCloseDialog);
      document.removeEventListener('customColumnsChanged', handleCustomColumnsChanged);
    };
  }, [selected]);

  const handleCreate = () => {
    setSelected({ name: '', description: '', customColumns: [] });
    setIsEdit(false);
    setOpen(true);
  };

  const handleEdit = (entity: MyEntityDTO) => {
    setSelected(entity);
    setIsEdit(true);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' });
      fetchEntities();
    } catch {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected) return;
    setSelected({ ...selected, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && selected?.id) {
        await axios.put(`${API_URL}/${selected.id}`, selected);
        setSnackbar({ open: true, message: 'Updated successfully', severity: 'success' });
      } else {
        await axios.post(API_URL, selected);
        setSnackbar({ open: true, message: 'Created successfully', severity: 'success' });
      }
      setOpen(false);
      fetchEntities();
    } catch {
      setSnackbar({ open: true, message: 'Save failed', severity: 'error' });
    }
  };

  return (
    <Router>
      <Box sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0
      }}>
        <AppBar position="sticky" color="primary" sx={{ boxShadow: 3, width: '100%' }}>
          <Toolbar sx={{ width: '100%' }}>
            <MenuBookIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700} color="inherit" sx={{ flexGrow: { xs: 1, md: 0 }, mr: 2 }}>
              Entity Management
            </Typography>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.8)', minWidth: 'auto' },
                '& .Mui-selected': { color: 'white' },
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' }
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Entities" component={Link} to="/" />
              <Tab label="Dashboard" component={Link} to="/dashboard" />
              <Tab label="Reports" component={Link} to="/reports" />
              <Tab label="Advanced Search" component={Link} to="/search" />
              <Tab label="Import/Export" component={Link} to="/import-export" />
            </Tabs>
          </Toolbar>
        </AppBar>

        {/* Hero Section shown only on home page */}
        <Routes>
          <Route path="/" element={
            <Box sx={{
              bgcolor: 'primary.dark',
              color: 'white',
              py: 6,
              width: '100%',
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=1000)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxSizing: 'border-box'
            }}>
              <Container disableGutters maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 5 }, boxSizing: 'border-box' }}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  Entity Management System
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mb: 4, maxWidth: '700px' }}>
                  A powerful system to manage your entities with full CRUD operations
                </Typography>

                <Grid component="div" container spacing={3} sx={{ mt: 2 }}>
                  <GridItem xs={12} sm={6} md={4}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', color: 'white' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DashboardIcon sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">{entities.length}</Typography>
                            <Typography variant="body2">Total Entities</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={4}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', color: 'white' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StorageIcon sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">H2</Typography>
                            <Typography variant="body2">Database</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={4}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', color: 'white' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <GroupIcon sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">Spring</Typography>
                            <Typography variant="body2">Backend</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </GridItem>
                </Grid>
              </Container>
            </Box>
          } />
          <Route path="*" element={null} />
        </Routes>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, p: 3, width: '100%', boxSizing: 'border-box' }}>
          <Container maxWidth="xl">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Routes accessible to any authenticated user */}
                <Route path="/" element={
                  <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, width: '100%', boxSizing: 'border-box' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" fontWeight={600}>Entity List</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                        sx={{ fontWeight: 600, borderRadius: 2, boxShadow: 2 }}
                      >
                        Add New Entity
                      </Button>
                    </Box>
                    <MyEntityList entities={entities} onEdit={handleEdit} onDelete={handleDelete} />
                  </Paper>
                } />

                <Route path="/dashboard" element={
                  <Dashboard entities={entities} isLoading={loading} />
                } />

                <Route path="/search" element={
                  <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, width: '100%', boxSizing: 'border-box' }}>
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>Advanced Search</Typography>
                    <AdvancedSearch
                      entities={entities}
                      availableFields={[
                        { name: 'name', type: CustomColumnType.TEXT },
                        { name: 'description', type: CustomColumnType.TEXT },
                        { name: 'createdDate', type: CustomColumnType.DATE },
                        { name: 'lastModifiedDate', type: CustomColumnType.DATE },
                        // Add custom column types that might be common across entities
                        ...(entities.length > 0 && entities[0].customColumns
                          ? entities[0].customColumns
                            .filter(col => col.name)
                            .map(col => ({
                              name: col.name,
                              type: col.columnType || CustomColumnType.TEXT
                            }))
                          : [])
                      ]}
                      onSearch={criteria => {
                        console.log("Search criteria:", criteria);
                        // We don't need to handle the search results explicitly here
                        // because the AdvancedSearch component now handles filtering internally
                      }}
                    />
                  </Paper>
                } />

                <Route path="/import-export" element={<ImportExportTools />} />
              </Route>

              {/* Admin/Moderator Only Routes */}
              <Route element={<ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']} />}>
                <Route path="/reports" element={
                  <Reports userRoles={AuthService.getRoles()} />
                } />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Box>

        {/* Footer */}
        <Box component="footer" sx={{ py: 3, bgcolor: 'primary.main', color: 'white', mt: 'auto', width: '100%', flexShrink: 0 }}>
          <Container disableGutters maxWidth={false}>
            <Typography variant="body2" align="center">
              © {new Date().getFullYear()} Entity Management System. Built with Spring Boot, React and Material-UI.
            </Typography>
          </Container>
        </Box>

        {/* Dialog and Snackbar */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogContent sx={{ p: 2 }}>
            {selected && (
              <MyEntityForm
                entity={selected}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
                isEdit={isEdit}
              />
            )}
          </DialogContent>
        </Dialog>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Router>
  );
};

export default App;
