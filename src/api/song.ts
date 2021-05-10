import { request, requestWithoutLoading } from '@/utils';

// 获取音乐url
export const getSongUrl = (id: number) => request.get(`/song/url?id=${id}`);

// 获取音乐详情
export const getSongDetail:any = (ids: number) => request.get(`/song/detail?ids=${ids}`);

// 新歌速递 全部:0/ 华语:7/欧美:96/ 日本:8/韩国:16
export const getTopSongs:any = (type: 0|7|96|8|16) => request.get(`/top/song?type=${type}`);

// 相似音乐
export const getSimiSongs:any = (id: number, option: any): any =>
  requestWithoutLoading.get(`/simi/song?id=${id}`, option);

// 歌词
export const getLyric = (id:number) => request.get(`/lyric?id=${id}`);
