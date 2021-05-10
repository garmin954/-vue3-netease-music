import { requestWithoutLoading } from '@/utils';

// 歌曲评论
interface CommentInterface {
  id: number;
  limit ?: number;
  offset ?: number;
  before ?: number;
}
export const getSongComment = (params: CommentInterface) =>
  requestWithoutLoading.get(`/comment/music`, { params });
// 歌单评论
export const getPlaylistComment = (params: CommentInterface) =>
  requestWithoutLoading.get(`/comment/playlist`, { params });
// 热门评论 0: 歌曲/1: mv/2: 歌单/3: 专辑/4: 电台/5: 视频
interface CommentHotInterface extends CommentInterface {
  type: 0|1|2|3|4|5;
}
export const getHotComment:any = (params: CommentHotInterface) =>
  requestWithoutLoading.get(`/comment/hot`, { params });
// mv评论
export const getMvComment = (params: CommentInterface) =>
  requestWithoutLoading.get('/comment/mv', { params });
