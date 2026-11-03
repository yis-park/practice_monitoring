export interface ResponsePlayerListItem {
  tpm_idx: number; // 재생목록 관리번호
  category_value: string; // 카테고리 번호
  category_name: string; // 카테고리명
  user_id: string; // 등록 유저
  node_id: number; // 지점 아이디
  node_name: string; // 지점명
  tpm_use: boolean; // 현재 재생 사용 여부
  sort_order: number; // 현재 재생 순서
  tpm_title: string; // 제목 = 상호명
  tpm_content: string; // 내용
  reg_date: string; // 등록일시 (예: "2025-06-02 13:36")
  file_id: number; // 파일 관리 아이디
  origin_file_name: string; // 원본 파일명
  run_time: number; // 파일 재생 시간
  qr_id: number; // QR 관리번호
  qr_url: string; // QR url
  qr_position: string; // QR 저장 위치 (JSON 문자열 형태)
  qr_size: number; // QR 사이즈
  qr_x: number; // QR x좌표
  qr_y: number; // QR y좌표
  file_endpoint: string; // 파일 다운로드 엔드포인트
  thumb_endpoint: string; // 썸네일 다운로드 엔드포인트 (동영상일 경우)
  qr_endpoint: string; // QR 이미지 다운로드 엔드포인트
}

export interface PlayerListItem {
  tmpIdx: number;
  thumbType: string;
  thumbnailUrl: string;
  playlistId: number;
  playlistName: string;
  playlistContent: string;
  category: string;
  uploadedAt: string;
  fileId: number;
  order: number;
  fileEndpoint: string;
  thumbEndpoint: string;
  qrEndpoint: string;
  durationInMs: number;
}

export interface PlayerListItemProps {
  item: PlayerListItem;
}

export interface PlayerListItemListProps {
  items: PlayerListItem[];
}

export interface QrImage {
  qr: string;
  xpos: number;
  ypos: number;
  size: number;
}

export interface PlayItemBrief {
  id: number; // fileId
  category: string;
  durationInMs: string;
  type: string;
  url: string;
  image?: QrImage | null;
}

export interface MediaPlayItem {
  id: number; // fileId
  tmpIdx: number; // playlistId
  tempId: number;
  order: number;
  url: string;
  durationInMs: string;
  type: string;
  thumbnailUrl: string;
  image?: QrImage | null;
}

export interface MediaPlayList {
  tmpIdx: number; // playlistId
  category: string;
  groupOrder: number;
  playlistName: string;
  playlistContent: string;
  uploadedAt: string;
  data: MediaPlayItem[];
  totalDurationInMs: string;
}
