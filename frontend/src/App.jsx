import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import Home from './pages/HomePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007AFF',
      secondary: '#1A1A1A',
    },
  },
  text: {
    primary: '#1A1A1A',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
}

export default App;
