import { request } from '@/utils';

export const getSearchHot = () => request.get('/search/hot');

export const getSearchSuggest = (keywords: string) => request.get('/search/suggest', { params: { keywords } });

// 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
interface SearchInterface {
  keywords: string;
  limit ?: number;
  offset ?: number;
  type ?: 1|10|100|1000|1002|1004|1006|1009|1014|1018;
}
export const getSearch = (params?: SearchInterface) => request.get(`/search`, { params });
