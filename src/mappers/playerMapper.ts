import { IMG_API_BASE } from '../config/appConfig';
import { downloadFileWithCache } from '../services/downloadApi';
import type { MediaPlayList, PlayerListItem, PlayerListItemListProps, ResponsePlayerListItem } from '../types/player';

export const parseCurrentPlaylists = async (raw: Record<string, ResponsePlayerListItem[]>): Promise<PlayerListItemListProps> => {
  const groups = Object.values(raw);
  const items: PlayerListItem[] = (
    await Promise.all(
      groups.map(async (group) => {
        const item = group[0];

        let blobUrl = '';

        try {
          blobUrl = (await downloadFileWithCache(item.thumb_endpoint || item.file_endpoint)) ?? '';
        } catch (e) {
          console.warn(`썸네일 다운로드 실패: ${item.thumb_endpoint || item.file_endpoint}`, e);
        }

        return {
          tmpIdx: item.tpm_idx,
          thumbType: item.thumb_endpoint ? 'video' : 'image',
          thumbnailUrl: blobUrl ?? '',
          playlistId: item.tpm_idx,
          playlistName: item.tpm_title,
          playlistContent: item.tpm_content,
          category: item.category_name,
          uploadedAt: item.reg_date,
          fileId: item.file_id,
          order: item.sort_order,
          fileEndpoint: item.file_endpoint,
          thumbEndpoint: item.thumb_endpoint,
          qrEndpoint: item.qr_endpoint,
          durationInMs: item.run_time,
        };
      })
    )
  ).sort((a, b) => a.order - b.order);

  return { items };
};

export const parsedMediaData = async (raw: Record<string, ResponsePlayerListItem[]>): Promise<MediaPlayList[]> => {
  const groupEntries = Object.values(raw);
  const result: MediaPlayList[] = await Promise.all(
    groupEntries.map(async (group) => {
      const category = group[0]?.category_name ?? '기타';
      const groupOrder = group[0]?.sort_order ?? 0;
      const tmpIdx = group[0]?.tpm_idx;
      const playlistName = group[0]?.tpm_title;
      const playlistContent = group[0]?.tpm_content;
      const uploadedAt = group[0]?.reg_date;
      let totalDurationInMs = 0;
      const data = await Promise.all(
        group.map(async (item, idx) => {
          const fileName = item.origin_file_name;
          const isVideo = fileName.toLowerCase().includes('mp4');
          let blobUrl = '';
          let qrUrl = '';

          try {
            if (isVideo) {
              blobUrl = `${IMG_API_BASE}${item.file_endpoint}`;
            } else {
              blobUrl = (await downloadFileWithCache(item.file_endpoint)) ?? '';
            }
          } catch (e) {
            console.warn(`파일 다운로드 실패: ${item.file_endpoint}`, e);
          }

          try {
            qrUrl = (await downloadFileWithCache(item.qr_endpoint)) ?? '';
          } catch (e) {
            console.warn(`QR 다운로드 실패: ${item.qr_endpoint}`, e);
          }

          totalDurationInMs += item.run_time;
          return {
            tmpIdx: item.tpm_idx,
            id: item.file_id,
            tempId: idx,
            order: item.sort_order,
            url: blobUrl ?? '',
            durationInMs: String(item.run_time),
            type: item.thumb_endpoint ? 'video' : 'image',
            thumbnailUrl: item.thumb_endpoint,
            ...(item.qr_endpoint &&
              qrUrl && {
                image: {
                  qr: qrUrl ?? '',
                  xpos: item.qr_x ?? 0,
                  ypos: item.qr_y ?? 0,
                  size: item.qr_size ?? 100,
                },
              }),
          };
        })
      );

      data.sort((a, b) => a.tempId - b.tempId);
      return {
        tmpIdx,
        category,
        data,
        groupOrder,
        playlistName,
        playlistContent,
        uploadedAt,
        totalDurationInMs: totalDurationInMs.toString(),
      };
    })
  );

  result.sort((a, b) => a.groupOrder - b.groupOrder);
  return result;
};
