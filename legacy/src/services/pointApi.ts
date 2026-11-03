import type { PointType, ResponsePoint } from '../types/point';
import { apiInstance } from './api';

export const getPointOptions = async () => {
  const serviceKey = import.meta.env.VITE_SERVICE_KEY;
  try {
    const response = await apiInstance.get('/node/list', {
      params: {
        serviceKey: serviceKey,
      },
    });
    const items = response.data.data || [];

    if (!items || items.length <= 0) {
      return [];
    }

    const options: PointType[] = (items as ResponsePoint[]).map((item) => ({
      pointId: item.sys_net_node_id,
      pointName: item.sys_net_node_name,
    }));

    return [{ pointId: -1, pointName: '선택 안함' }, ...options];
  } catch (error) {
    console.error('지점 목록 가져오기 실패:', error);
    return [];
  }
};
