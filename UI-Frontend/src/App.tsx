import React, { useEffect, useState, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Dialog, 
  DialogContent, 
  Snackbar, 
  Alert, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import MyEntityList from './components/MyEntityList';
import MyEntityForm from './components/MyEntityForm';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import AdvancedSearch from './components/AdvancedSearch';
import ImportExportTools from './components/ImportExportTools';
import Login from './components/Login';
import Signup from './components/Signup';
import Unauthorized from './components/Unauthorized';
import Profile from './components/Profile';
import GridItem from './components/utils/GridItem';
import type { MyEntityDTO } from './types/MyEntityDTO';
import { CustomColumnType } from './types/MyEntityDTO';
import AuthService from './services/auth.service';
import http from './services/http';
import { API_URLS } from './config/api-config';

const API_URL = API_URLS.ENTITIES;

// User Menu Component
interface UserMenuProps {
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = AuthService.getCurrentUser();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };

  if (!user) return null;

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || user.username?.charAt(0).toUpperCase();

  return (
    <>
      <Tooltip title="Account">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}>
            {initials}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 220,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {user.roles?.map((role: string) => (
              <Chip 
                key={role} 
                label={role.replace('ROLE_', '')} 
                size="small" 
                color={role === 'ROLE_ADMIN' ? 'error' : role === 'ROLE_MODERATOR' ? 'warning' : 'default'}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleNavigate('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        {AuthService.isAdmin() && (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            Admin Panel
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

// Navigation component to sync tabs with route
const NavigationTabs: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const location = useLocation();
  
  const getTabValue = () => {
    switch (location.pathname) {
      case '/': return 0;
      case '/dashboard': return 1;
      case '/reports': return 2;
      case '/search': return 3;
      case '/import-export': return 4;
      default: return false;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Tabs
      value={getTabValue()}
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
  );
};

// Main App Content (inside Router)
const AppContent: React.FC = () => {
  const [entities, setEntities] = useState<MyEntityDTO[]>([]);
  const [selected, setSelected] = useState<MyEntityDTO | null>(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  const fetchEntities = useCallback(async () => { 
    setLoading(true);
    try {
      const token = AuthService.getToken();
      if (!token) {
        setEntities([]);
        setLoading(false);
        return;
      }

      const res = await http.get<MyEntityDTO[]>(API_URL);
      setEntities(res.data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setSnackbar({ open: true, message: 'Session expired. Please sign in again.', severity: 'warning' });
      } else {
        setSnackbar({ open: true, message: 'Failed to fetch entities', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEntities();
    } else {
      setEntities([]);
      setLoading(false);
    }
  }, [isAuthenticated, fetchEntities]);

  useEffect(() => {
    const handleCloseDialog = () => setOpen(false);
    document.addEventListener('closeDialog', handleCloseDialog);

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

  useEffect(() => {
    const updateAuth = () => {
      const newAuthState = AuthService.isAuthenticated();
      setIsAuthenticated(newAuthState);
      if (!newAuthState) {
        setEntities([]);
      }
    };
    updateAuth();
    window.addEventListener('auth-changed', updateAuth);
    window.addEventListener('storage', updateAuth);
    return () => {
      window.removeEventListener('auth-changed', updateAuth);
      window.removeEventListener('storage', updateAuth);
    };
  }, []);

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
    if (!window.confirm('Are you sure you want to delete this entity?')) {
      return;
    }
    try {
      await http.delete(`${API_URL}/${id}`);
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
        await http.put(`${API_URL}/${selected.id}`, selected);
        setSnackbar({ open: true, message: 'Updated successfully', severity: 'success' });
      } else {
        await http.post(API_URL, selected);
        setSnackbar({ open: true, message: 'Created successfully', severity: 'success' });
      }
      setOpen(false);
      fetchEntities();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Save failed';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setEntities([]);
    setSnackbar({ open: true, message: 'Logged out successfully', severity: 'info' });
  };

  const userRoles = AuthService.getRoles();
  const currentUser = AuthService.getCurrentUser();

  return (
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
          <Typography 
            variant="h5" 
            fontWeight={700} 
            color="inherit" 
            sx={{ flexGrow: { xs: 1, md: 0 }, mr: 2 }}
            component={Link}
            to="/"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Entity Management
          </Typography>
          
          <NavigationTabs isAuthenticated={isAuthenticated} />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {isAuthenticated ? (
              <UserMenu onLogout={handleLogout} />
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ color: 'white' }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/signup"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section - only for authenticated users on home page */}
      <Routes>
        <Route path="/" element={
          isAuthenticated ? (
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
                  Welcome, {currentUser?.firstName || 'User'}!
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mb: 4, maxWidth: '700px' }}>
                  Manage your entities with full CRUD operations, custom columns, and powerful analytics
                </Typography>

                <Grid component="div" container spacing={3} sx={{ mt: 2 }}>
                  <GridItem xs={12} sm={6} md={3}>
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
                  <GridItem xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', color: 'white' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StorageIcon sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">
                              {entities.reduce((acc, e) => acc + (e.customColumns?.length || 0), 0)}
                            </Typography>
                            <Typography variant="body2">Custom Columns</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', color: 'white' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <GroupIcon sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">
                              {userRoles.length}
                            </Typography>
                            <Typography variant="body2">Your Roles</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', color: 'white' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">Active</Typography>
                            <Typography variant="body2">Session Status</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </GridItem>
                </Grid>
              </Container>
            </Box>
          ) : null
        } />
        <Route path="*" element={null} />
      </Routes>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, p: 3, width: '100%', boxSizing: 'border-box' }}>
        <Container maxWidth="xl">
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />
            <Route path="/signup" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Signup />
            } />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route path="/" element={
              isAuthenticated ? (
                <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, width: '100%', boxSizing: 'border-box' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
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
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h4" gutterBottom fontWeight={600}>
                    Welcome to Entity Management System
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Please sign in to manage your entities
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      size="large" 
                      component={Link} 
                      to="/login"
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large" 
                      component={Link} 
                      to="/signup"
                    >
                      Create Account
                    </Button>
                  </Box>
                </Box>
              )
            } />

            <Route path="/dashboard" element={
              isAuthenticated ? (
                <Dashboard entities={entities} isLoading={loading} />
              ) : (
                <Navigate to="/login" state={{ from: { pathname: '/dashboard' } }} replace />
              )
            } />

            <Route path="/search" element={
              isAuthenticated ? (
                <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, width: '100%', boxSizing: 'border-box' }}>
                  <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>Advanced Search</Typography>
                  <AdvancedSearch
                    entities={entities}
                    availableFields={[
                      { name: 'name', type: CustomColumnType.TEXT },
                      { name: 'description', type: CustomColumnType.TEXT },
                      { name: 'createdDate', type: CustomColumnType.DATE },
                      { name: 'lastModifiedDate', type: CustomColumnType.DATE },
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
                    }}
                  />
                </Paper>
              ) : (
                <Navigate to="/login" state={{ from: { pathname: '/search' } }} replace />
              )
            } />

            <Route path="/import-export" element={
              isAuthenticated ? (
                <ImportExportTools />
              ) : (
                <Navigate to="/login" state={{ from: { pathname: '/import-export' } }} replace />
              )
            } />
            
            <Route path="/reports" element={
              isAuthenticated ? (
                <Reports userRoles={userRoles} />
              ) : (
                <Navigate to="/login" state={{ from: { pathname: '/reports' } }} replace />
              )
            } />

            <Route path="/profile" element={
              isAuthenticated ? (
                <Profile />
              ) : (
                <Navigate to="/login" state={{ from: { pathname: '/profile' } }} replace />
              )
            } />

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

      {/* Entity Form Dialog */}
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

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
