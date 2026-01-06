import { createTheme, alpha } from '@mui/material/styles';

// Classic Quant Firm Color Palette
// Inspired by: Two Sigma, Renaissance Technologies, Citadel, DE Shaw
export const quantColors = {
  // Primary Dark Navy
  primary: {
    main: '#0a1628',
    light: '#1a2942',
    dark: '#050d17',
    contrastText: '#ffffff',
  },
  // Accent Cyan/Teal for data visualization
  accent: {
    main: '#00d4aa',
    light: '#33debb',
    dark: '#00a88a',
    contrastText: '#000000',
  },
  // Gold for premium/highlight elements
  gold: {
    main: '#d4af37',
    light: '#e5c766',
    dark: '#a68b2b',
  },
  // Background colors
  background: {
    default: '#0a1628',
    paper: '#111d32',
    elevated: '#162236',
    card: '#1a2942',
  },
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    muted: '#64748b',
    accent: '#00d4aa',
  },
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  // Chart colors
  chart: {
    green: '#00d4aa',
    red: '#ef4444',
    blue: '#3b82f6',
    yellow: '#f59e0b',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
  },
  // Border colors
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    default: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.2)',
  },
};

// Create the MUI theme
export const quantTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: quantColors.accent.main,
      light: quantColors.accent.light,
      dark: quantColors.accent.dark,
      contrastText: quantColors.accent.contrastText,
    },
    secondary: {
      main: quantColors.gold.main,
      light: quantColors.gold.light,
      dark: quantColors.gold.dark,
    },
    background: {
      default: quantColors.background.default,
      paper: quantColors.background.paper,
    },
    text: {
      primary: quantColors.text.primary,
      secondary: quantColors.text.secondary,
    },
    success: {
      main: quantColors.success,
    },
    warning: {
      main: quantColors.warning,
    },
    error: {
      main: quantColors.error,
    },
    info: {
      main: quantColors.info,
    },
    divider: quantColors.border.default,
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
      color: quantColors.text.secondary,
    },
    subtitle2: {
      fontWeight: 500,
      color: quantColors.text.muted,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    overline: {
      fontWeight: 700,
      letterSpacing: '0.1em',
      fontSize: '0.7rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${quantColors.text.muted} ${quantColors.background.paper}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            background: quantColors.background.paper,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 4,
            backgroundColor: quantColors.text.muted,
            minHeight: 40,
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: quantColors.text.secondary,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: quantColors.primary.main,
          backgroundImage: 'none',
          borderBottom: `1px solid ${quantColors.border.subtle}`,
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '10px 20px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 4px 12px ${alpha(quantColors.accent.main, 0.4)}`,
          },
        },
        outlined: {
          borderColor: quantColors.border.strong,
          '&:hover': {
            borderColor: quantColors.accent.main,
            backgroundColor: alpha(quantColors.accent.main, 0.08),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: quantColors.background.card,
          backgroundImage: 'none',
          border: `1px solid ${quantColors.border.subtle}`,
          borderRadius: 12,
          boxShadow: `0 4px 24px ${alpha('#000000', 0.2)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          backgroundColor: quantColors.background.paper,
          boxShadow: `0 2px 12px ${alpha('#000000', 0.15)}`,
        },
        elevation2: {
          backgroundColor: quantColors.background.elevated,
          boxShadow: `0 4px 20px ${alpha('#000000', 0.2)}`,
        },
        elevation3: {
          backgroundColor: quantColors.background.card,
          boxShadow: `0 8px 32px ${alpha('#000000', 0.25)}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: alpha(quantColors.background.default, 0.5),
            '& fieldset': {
              borderColor: quantColors.border.default,
            },
            '&:hover fieldset': {
              borderColor: quantColors.border.strong,
            },
            '&.Mui-focused fieldset': {
              borderColor: quantColors.accent.main,
            },
          },
          '& .MuiInputLabel-root': {
            color: quantColors.text.secondary,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          backgroundColor: quantColors.accent.main,
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
          color: quantColors.text.secondary,
          '&.Mui-selected': {
            color: quantColors.accent.main,
          },
          '&:hover': {
            color: quantColors.text.primary,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: quantColors.background.elevated,
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: quantColors.text.secondary,
            borderBottom: `1px solid ${quantColors.border.default}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(quantColors.accent.main, 0.04),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${quantColors.border.subtle}`,
          padding: '16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        outlined: {
          borderColor: quantColors.border.default,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: quantColors.background.elevated,
          backgroundImage: 'none',
          borderRadius: 16,
          border: `1px solid ${quantColors.border.default}`,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: alpha(quantColors.success, 0.15),
          color: quantColors.success,
        },
        standardError: {
          backgroundColor: alpha(quantColors.error, 0.15),
          color: quantColors.error,
        },
        standardWarning: {
          backgroundColor: alpha(quantColors.warning, 0.15),
          color: quantColors.warning,
        },
        standardInfo: {
          backgroundColor: alpha(quantColors.info, 0.15),
          color: quantColors.info,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: quantColors.background.elevated,
          backgroundImage: 'none',
          border: `1px solid ${quantColors.border.default}`,
          borderRadius: 12,
          marginTop: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '10px 16px',
          '&:hover': {
            backgroundColor: alpha(quantColors.accent.main, 0.08),
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(quantColors.accent.main, 0.2),
          color: quantColors.accent.main,
          fontWeight: 600,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: quantColors.border.subtle,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: quantColors.background.card,
          color: quantColors.text.primary,
          border: `1px solid ${quantColors.border.default}`,
          borderRadius: 8,
          fontSize: '0.75rem',
          padding: '8px 12px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: alpha(quantColors.accent.main, 0.15),
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: quantColors.accent.main,
        },
      },
    },
  },
});

// Custom styled components helpers
export const glassEffect = {
  background: `linear-gradient(135deg, ${alpha(quantColors.background.card, 0.8)} 0%, ${alpha(quantColors.background.paper, 0.6)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${quantColors.border.subtle}`,
};

export const gradientText = {
  background: `linear-gradient(135deg, ${quantColors.accent.main} 0%, ${quantColors.gold.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export const accentGlow = {
  boxShadow: `0 0 20px ${alpha(quantColors.accent.main, 0.3)}, 0 4px 16px ${alpha('#000', 0.2)}`,
};

export default quantTheme;
