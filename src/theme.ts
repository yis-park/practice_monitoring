import { createTheme } from '@mui/material/styles';

const materialTheme = createTheme({
  palette: {
    primary: {
      main: '#2364A2',
    },
    secondary: {
      main: '#F57C00',
    },
    background: {
      default: '#fff',
      paper: '#222',
    },
    text: {
      primary: '#000000',
      secondary: '#ffffff',
    },
    divider: '#A4C5E6',
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'sans-serif',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          backgroundColor: '#A4C5E6',
          color: '#2364A2',
          '&:hover': {
            backgroundColor: '#A4C5E6',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: 8,
          fontSize: '0.95rem',
          color: '#333',
        },
        icon: {
          color: '#2364A2',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#333',
          fontSize: '0.9rem',
          '&.Mui-focused': {
            color: '#E3EFF8',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          paddingTop: 12,
          paddingBottom: 12,
          backgroundColor: '#fff',
          color: '#333',
          '&:hover': {
            backgroundColor: '#E3EFF8',
          },
          '&.Mui-selected': {
            backgroundColor: '#A4C5E6',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#8FB2DA',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#E3EFF8',
          '&.Mui-checked': {
            color: '#fff',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#fff',
          },
        },
        track: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#fff',
        },
      },
    },
  },
});

export default materialTheme;
