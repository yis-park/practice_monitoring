import { Box, Button, Typography } from '@mui/material';
import JecheonLogo from '@/assets/jecheon_logo2.png';
import type { MediaPlayItem } from '../types/player';
import MainPlayer from './MainPlayer';

type PlayerStageProps = {
  category: string;
  currentPlayItem: MediaPlayItem | null;
  currentVideoTime: {
    media: MediaPlayItem;
    progressTime: number;
  } | null;
  onMoveToPortal: () => void;
  onRetry: () => Promise<void>;
  playlistError: Error | null;
};

const PlayerStage = ({ category, currentPlayItem, currentVideoTime, onMoveToPortal, onRetry, playlistError }: PlayerStageProps) => {
  if (currentPlayItem) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
        >
          <MainPlayer currentPlayItem={currentPlayItem} currentVideoTime={currentVideoTime} />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <Box
            component="img"
            src={JecheonLogo}
            alt="제천로고"
            sx={{
              width: { xs: '100px', sm: '120px', md: '170px', lg: '170px' },
              objectFit: 'contain',
              backgroundColor: 'none',
              userSelect: 'none',
            }}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: '145px',
            right: '20px',
            zIndex: 10,
            pointerEvents: 'auto',
            visibility: category === '관광' ? 'visible' : 'hidden',
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              pt: 1.5,
              pb: 1.5,
              px: 1,
              width: { xs: '100px', sm: '120px', md: '170px', lg: '170px' },
            }}
            onClick={onMoveToPortal}
          >
            관광 포털 바로가기
          </Button>
        </Box>
      </Box>
    );
  }

  if (playlistError) {
    return (
      <Box
        sx={{
          backgroundColor: '#222',
          color: '#fff',
          fontFamily: 'Segoe UI, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          재생 목록을 불러올 수 없습니다
        </Typography>
        <Typography variant="body1" sx={{ color: '#ccc' }}>
          네트워크 연결이 불안정하거나 일시적인 오류가 발생했습니다.
          <br />
          아래 버튼을 눌러 다시 시도해주세요.
        </Typography>
        <Button
          onClick={onRetry}
          sx={{
            mt: 4,
            padding: '12px 32px',
            fontSize: '1rem',
            backgroundColor: '#1976d2',
            color: '#fff',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          다시 시도
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: { xs: 'auto', sm: '100%' },
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        재생 중인 영상이 없습니다.
      </Typography>
    </Box>
  );
};

export default PlayerStage;
