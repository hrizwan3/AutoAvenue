import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/SearchPage';
import SongsPage from './pages/HiddenGemsPage';
import AlbumInfoPage from './pages/ComparePage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0F0F0F', // Black Onyx
    },
    secondary: {
      main: '#D4AF37', // Gold
    },
    background: {
      default: '#F0EAD6', // Pearl White
    },
    text: {
      primary: '#0F0F0F',
      secondary: '#D4AF37',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: 14,
    h1: {
      fontWeight: 300,
      fontSize: '6rem',
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 300,
      fontSize: '3.75rem',
      letterSpacing: '-0.00833em',
    },
    button: {
      fontWeight: 500,
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/hidden_gems" element={<HiddenGemsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}