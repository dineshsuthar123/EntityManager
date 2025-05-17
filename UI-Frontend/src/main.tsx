import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

// Create a theme with consistent styling
const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          width: '100%',
        },
        body: {
          height: '100%',
          width: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        },
        '#root': {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }
      },
    },
  },
});

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
