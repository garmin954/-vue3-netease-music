import { request } from '@/utils';

export const getArtists = (id: number): any => request.get(`/artists?id=${id}`);
