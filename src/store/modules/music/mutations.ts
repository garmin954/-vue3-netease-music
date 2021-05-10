import { shallowEqual } from '@/utils';
import {ElNotification} from 'element-plus';
export default {
  setCurrentSong(state: any, song: any) {
    state.currentSong = song;
  },
  setCurrentTime(state: any, time: any) {
    state.currentTime = time;
  },
  setPlayingState(state: any, playing: any) {
    const {currentSong: {is_vip, name} } = state;
    if (is_vip) {
      ElNotification({
        message: `歌曲【${name}】不支持播放！`,
        type: 'warning',
        duration: 30000,
      });
      return 'is_vip';
    }
    state.playing = playing;
  },
  setPlayMode(state: any, mode: any) {
    state.playMode = mode;
  },
  setPlaylistShow(state: any, show: any) {
    state.isPlaylistShow = show;
  },
  setPlayerShow(state: any, show: any) {
    state.isPlayerShow = show;
  },
  setPlaylistPromptShow(state: any, show: any) {
    state.isPlaylistPromptShow = show;
  },
  setPlaylist(state: any, playlist: any) {
    const { isPlaylistShow, playlist: oldPlaylist } = state;
    state.playlist = playlist;
    // 播放列表未显示 并且两次播放列表的不一样 则弹出提示
    if (!isPlaylistShow && !shallowEqual(oldPlaylist, playlist, 'id')) {
      state.isPlaylistPromptShow = true;
      setTimeout(() => {
        state.isPlaylistPromptShow = false;
      }, 2000);
    }
  },
  setPlayHistory(state: any, history: any) {
    state.playHistory = history;
  },
  setMenuShow(state: any, show: any) {
    state.isMenuShow = show;
  },
};
