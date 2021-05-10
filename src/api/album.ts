import { request } from '@/utils';
export const getAlbum = (id: number): any => request.get(`/album?id=${id}`);

interface AlbumInterface {
  id: number;
  limit?: number;
  offset?: number;
}
export const getArtistAlbum = (params: AlbumInterface): any => request.get(`/artist/album`, {params});

interface AlbumCommentInterface {
  id: number;
  limit?: number;
  offset?: number;
}
export const getThumbComment = (params: AlbumCommentInterface): any => request.get(`/comment/album`, {params});
