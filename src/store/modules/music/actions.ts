import Storage from 'js-cookie';
import { PLAY_HISTORY_KEY,  getSongImg } from '@/utils';
import {ElNotification} from 'element-plus';

export default {
  // 整合歌曲信息 并且开始播放
  async startSong({ commit, state }: any, rawSong?: any) {
    // 浅拷贝一份 改变引用
    // 1.不污染元数据
    // 2.单曲循环为了触发watch
    const song = Object.assign({}, rawSong);
    if (!song.img) {
      if (song.albumId) {
        song.img = await getSongImg(song.id, song.albumId);
      }
    }
    commit('setCurrentSong', song);
    commit('setPlayingState', true);

    // 历史记录
    let { playHistory } = state;
    // playHistory = JSON.parse(playHistory);
    const playHistoryCopy = playHistory.slice();
    const findedIndex = playHistoryCopy.findIndex(({ id }:any) => song.id === id);

    if (findedIndex !== -1) {
      // 删除旧那一项, 插入到最前面
      playHistoryCopy.splice(findedIndex, 1);
    }
    playHistoryCopy.unshift(song);
    commit('setPlayHistory', playHistoryCopy);
    Storage.set(PLAY_HISTORY_KEY, playHistoryCopy);
  },
  clearCurrentSong({ commit }: any) {
    commit('setCurrentSong', {});
    commit('setPlayingState', false);
    commit('setCurrentTime', 0);
  },
  clearPlaylist({ commit, dispatch }: any) {
    commit('setPlaylist', []);
    dispatch('clearCurrentSong');
  },
  clearHistory({ commit }: any) {
    const history: any [] = [];
    commit('setPlayHistory', history);
    Storage.set(PLAY_HISTORY_KEY, history);
  },
  addToPlaylist({ commit, state }: any, song: any) {
    const { playlist } = state;
    const copy = playlist.slice();
    if (!copy.find(({ id }: any) => id === song.id)) {
      copy.unshift(song);
      commit('setPlaylist', copy);
    }

    ElNotification({
      message: `添加歌曲到列表成功！`,
      type: 'success',
      duration: 2000,
    });
  },
};
