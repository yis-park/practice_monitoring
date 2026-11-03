import { SERVICE_KEY } from '../config/appConfig';
import type { DeleteResponse } from '../types/playerApi';
import { apiInstance } from './api';

export const getPlaylists = async (pointId: number) => {
  if (pointId === -1) {
    return null;
  }

  try {
    const params: Record<string, string | number> = {
      serviceKey: SERVICE_KEY,
      node_id: pointId,
    };

    const response = await apiInstance.get(`/playlist/list`, {
      params,
    });

    return response.data.data;
  } catch (error) {
    console.error(`플레이리스트 가져오기 실패 (pointId=${pointId})`, error);
    return null;
  }
};

/**
 * 특정 지점의 재생 중인 재생 목록 조회
 * @param pointId 지점 아이디
 * @returns
 */
export const getCurrentPlaylists = async (pointId: number) => {
  if (pointId === -1) {
    return null;
  }
  try {
    const endPoint = '/playlist/current';

    const params: Record<string, string | number> = {
      serviceKey: SERVICE_KEY,
      node_id: pointId,
    };

    const response = await apiInstance.get(endPoint, { params });

    if (response.data.success === false) {
      console.error(`현재 재생 중인 플레이리스트 목록 가져오기 실패 (pointId=${pointId})`, response.data.message);
      throw new Error(`현재 재생 중인 플레이리스트 목록 가져오기 실패 (pointId=${pointId}): ${response.data.message}`);
    }

    return response.data.data;
  } catch (error) {
    console.error(`현재 재생 중인 플레이리스트 목록 가져오기 실패 (pointId=${pointId})`, error);
    throw error;
  }
};

export const deletePlayedEmergencyNews = async (nodeId: number): Promise<DeleteResponse> => {
  if (nodeId === -1) {
    return {
      success: false,
      message: 'Invalid nodeId',
      data: null,
      totalCount: 0,
      currentPage: 0,
      totalPage: 0,
      currentElement: 0,
    };
  }

  try {
    const endPoint = '/emergency/current/delete';

    const params = {
      serviceKey: SERVICE_KEY,
      node_id: nodeId,
    };

    const response = await apiInstance.post<{
      success: boolean;
      message: string | null;
      data: DeleteResponse;
    }>(endPoint, params);

    if (!response.data.success) {
      console.error(`긴급뉴스 삭제 실패 (nodeId=${nodeId})`, response.data.message);
      throw new Error(`긴급뉴스 삭제 실패 (nodeId=${nodeId}): ${response.data.message}`);
    }

    return response.data.data;
  } catch (error) {
    console.error(`긴급뉴스 삭제 실패 (nodeId=${nodeId})`, error);
    throw error;
  }
};
