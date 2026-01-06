import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { quantTheme } from './theme/quantTheme'

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={quantTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
