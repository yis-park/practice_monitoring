import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

type ExitDialogProps = {
  count: number;
  maxCount: number;
  onCancel: () => void;
  onExit: () => void;
  open: boolean;
};

const ExitDialog = ({ count, maxCount, onCancel, onExit, open }: ExitDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          textAlign: 'center',
          px: 4,
          py: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}
      >
        세션 종료 예정
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          활동이 없어 잠시 후 자동으로 로그아웃됩니다.
          <br />
          계속 사용하시려면 아래 버튼을 클릭해주세요.
        </Typography>

        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={90}
            thickness={5}
            sx={{
              color: '#e0e0e0',
            }}
          />
          <CircularProgress
            variant="determinate"
            value={(count / maxCount) * 100}
            size={90}
            thickness={5}
            sx={{
              position: 'absolute',
              left: 0,
              color: '#1976d2',
              transform: 'rotate(-90deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {count}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
        <Button onClick={onCancel} variant="text" color="primary" sx={{ px: 2 }} size="large">
          계속 사용하기
        </Button>
        <Button onClick={onExit} variant="text" color="inherit" sx={{ px: 2 }} size="large">
          종료하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExitDialog;
