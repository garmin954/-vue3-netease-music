import { requestWithoutLoading } from '@/utils';

export const getUserDetail = (uid: number) => requestWithoutLoading.get('/user/detail', { params: { uid } });

const PLAYLIST_LIMIT = 1000;
export const getUserPlaylist = (uid: number) => requestWithoutLoading.get('/user/playlist', { params: { uid, limit: PLAYLIST_LIMIT } });
