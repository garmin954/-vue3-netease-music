import { request } from '@/utils';

export const getBanner: any = () => request.get('/banner?type=0');

export const getNewSongs: any = () => request.get('/personalized/newsong', {limit: 12} as any);

interface PersonalizedInterface {
  limit?: number;
}
export const getPersonalized: any = (params: PersonalizedInterface) =>
  request.get(`/personalized`, { params });

export const getPersonalizedMv = (): any => request.get(`/personalized/mv`);
