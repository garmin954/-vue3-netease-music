import { request } from '@/utils';

// 获取歌单详情 s : 歌单最近的 s 个收藏者,默认为8
interface ListDetail {
  id: number;
  s?: number;
}
export const getListDetail: any = (params:ListDetail) =>
  request.get('/playlist/detail', { params });
