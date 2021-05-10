import Cookies from 'js-cookie';
import { PLAY_HISTORY_KEY } from '@/utils';
import { playModeMap } from '@/utils/config';
import {SongInterface} from '@/utils/interface';
export interface MusicStateInterface {
  // 当前播放歌曲
  currentSong : SongInterface | {};
  // 当前播放时长
  currentTime: number;
  // 播放状态
  playing: boolean;
  // 播放模式
  playMode: string;
  // 播放列表显示
  isPlaylistShow: boolean;
  // 播放提示显示
  isPlaylistPromptShow: boolean;
  // 歌曲详情页显示
  isPlayerShow: boolean;
  // 播放列表数据
  playlist: any [];
  // 播放历史数据
  playHistory: any [];
  // 菜单显示
  isMenuShow: boolean;
}
export default {
  currentSong: {},
  currentTime: 0,
  playing: false,
  playMode: playModeMap.sequence.code,
  isPlaylistShow: false,
  isPlaylistPromptShow: false,
  isPlayerShow: false,
  playlist: [],
  playHistory: Cookies.getJSON(PLAY_HISTORY_KEY)  || [],
  isMenuShow: true,
} as MusicStateInterface;
