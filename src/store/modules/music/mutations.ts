import { shallowEqual } from '@/utils';
import {ElNotification} from 'element-plus';
import {SongInterface} from '@/utils/interface';
import {MusicStateInterface} from '@/store/modules/music/state';

export default {
  setCurrentSong(state: MusicStateInterface, song: SongInterface) {
    state.currentSong = song;
  },
  setCurrentTime(state: MusicStateInterface, time: number) {
    state.currentTime = time;
  },
  setPlayingState(state: MusicStateInterface, playing: boolean) {
    const {currentSong} = state;
    if (currentSong !== {}) {
      const {is_vip, name}  = currentSong as SongInterface;
      if (is_vip) {
        ElNotification({
          message: `歌曲【${name}】不支持播放！`,
          type: 'warning',
          duration: 30000,
        });
        return 'is_vip';
      }

      state.playing = playing;
    }

  },
  // 设置播放模式
  setPlayMode(state: MusicStateInterface, mode: string) {
    state.playMode = mode;
  },
  // 歌曲列表
  setPlaylistShow(state: MusicStateInterface, show: boolean) {
    state.isPlaylistShow = show;
  },
  // 播放器显示
  setPlayerShow(state: MusicStateInterface, show: boolean) {
    state.isPlayerShow = show;
  },
  // 播放提示显示
  setPlaylistPromptShow(state: MusicStateInterface, show: boolean) {
    state.isPlaylistPromptShow = show;
  },
  // 设置播放列表
  setPlaylist(state: MusicStateInterface, playlist: SongInterface []) {
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
  // 设置播放历史
  setPlayHistory(state: MusicStateInterface, history: SongInterface []) {
    state.playHistory = history;
  },
  // 菜单显示
  setMenuShow(state: MusicStateInterface, show: boolean) {
    state.isMenuShow = show;
  },
};
