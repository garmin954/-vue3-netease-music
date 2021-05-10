import {genArtistisText} from '@/utils/business';

// 歌曲接口
export interface SongInterface {
  id: number;
  name: string;
  img: string;
  artists: ArtistInterface[];
  duration: number;
  albumName: string;
  url: string;
  artistsText: string;
  durationSecond: number;
  // 专辑 如果需要额外请求封面的话必须加上
  albumId: number;
  // mv的id 如果有的话 会在songTable组件中加上mv链接。
  mvId: number;
  is_vip: boolean;
  [propName: string]: any;
}
// 艺术家
export interface ArtistInterface {
  albumSize: number;
  alias: any [];
  briefDesc: string;
  followed: boolean;
  id: number;
  img1v1Id: bigint;
  img1v1Id_str: string;
  img1v1Url: string;
  musicSize: number;
  name: string;
  picId: number;
  picUrl: string;
  topicPerson: number;
  trans: string;
}

// 歌词
export interface LyricsInterface{

}

