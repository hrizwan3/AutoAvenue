import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import HiddenGemsPage from './pages/HiddenGemsPage';
import ComparePage from './pages/ComparePage'
import ReviewsPage from './pages/ReviewsPage'
import ReviewSpec from './pages/ReviewSpec'
import CarSafetyRankings from './pages/CarSafetyRanking.js'


const theme = createTheme({
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#b0bec5',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.4rem',
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // More subtle rounded corners for a refined look
          textTransform: 'none', // Avoids capitalization for a more elegant appearance
          fontSize: '0.9rem', // Smaller button text for a more understated design
        }
      }
    }
  }
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
          <Route path="/reviews/:make/:model" element={<ReviewSpec />} />
          <Route path="/carsafetyratings" element={<CarSafetyRankings />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}