import { request } from '@/utils';

export const getMvDetail = (id: number) => request.get(`/mv/detail?mvid=${id}`);

export const getMvUrl = (id: number) => request.get(`/mv/url?id=${id}`);

export const getSimiMv = (id: number) => request.get(`/simi/mv?mvid=${id}`);

interface MvInterface {
  area ?: '全部'|'内地'|'港台'|'欧美'|'日本'|'韩国';
  order ?: '上升最快'|'最热'|'最新'|'不填则为上升最快';
  limit ?: number;
  offset ?: number;
}
export const getAllMvs = (params: MvInterface) => request.get(`/mv/all`, {params});

interface ArtistsMvInterface {
  id: number;
  limit?: number;
  offset?: number;
}
export const getArtistsMv = (params: ArtistsMvInterface): any => request.get(`/artist/mv`, {params});
