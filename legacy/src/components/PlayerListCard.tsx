import { Box, Typography, Stack } from '@mui/material';
import type { PlayerListItem } from '../types/player';

const PlayerListCard = ({ item, selected = false }: { item: PlayerListItem; selected: boolean }) => {
  if (!item) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 4,
        p: 1.5,
        height: { xs: 'auto', md: 180 },
        borderRadius: 2,
        backgroundColor: selected ? '#A4C5E64D' : 'primary.main',
        border: '1px solid',
        borderColor: 'divider',
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: { xs: '100px', sm: '120px', md: '160px' },
          aspectRatio: '1 / 1',
          borderRadius: 1,
          backgroundColor: 'divider',
          overflow: 'hidden',
          p: 1,
        }}
      >
        {item.thumbnailUrl && item.thumbnailUrl !== '' ? (
          <Box
            component="img"
            src={item.thumbnailUrl}
            alt="썸네일"
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'cover',
              backgroundColor: 'divider',
              userSelect: 'none',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              썸네일 없음
            </Typography>
          </Box>
        )}
      </Box>

      <Stack spacing={1} sx={{ color: 'text.secondary', userSelect: 'none' }}>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
          재생 목록 번호: {item.playlistId}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
          재생 목록명: {item.playlistName}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
          카테고리: {item.category}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
          업로드일: {item.uploadedAt}
        </Typography>
      </Stack>
    </Box>
  );
};

export default PlayerListCard;
