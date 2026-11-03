import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

type LoadingOverlayProps = {
  fixed?: boolean;
  open: boolean;
  text?: string;
};

const LoadingOverlay = ({ fixed = false, open, text }: LoadingOverlayProps) => {
  if (!open) return null;

  const content = (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <CircularProgress color="inherit" />
      {text ? <Typography variant="h6">{text}</Typography> : null}
    </Box>
  );

  if (fixed) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 2000,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={open}>
      {content}
    </Backdrop>
  );
};

export default LoadingOverlay;
