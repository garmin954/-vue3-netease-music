import { request, requestWithoutLoading } from '@/utils';
// 获取歌单
export interface PlaylistInterface {
  order ?: 'new'|'hot';
  cat ?: string|'全部'|'华语'|'古风'|'欧美'|'流行';
  limit ?: number;
  offset ?: number;
  before ?: number;
}
export const getPlaylists = (params: PlaylistInterface):any => request.get('/top/playlist', { params });
// 精品歌单
export const getTopPlaylists = (params: PlaylistInterface):any => request.get('/top/playlist/highquality', { params });
// 获取相似歌单
export const getSimiPlaylists: any = (id: number, option: any) => requestWithoutLoading.get(`/simi/playlist?id=${id}`, option);
