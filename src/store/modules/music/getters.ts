import { isDef, playModeMap } from '@/utils';
import {MusicStateInterface} from './state';
import {SongInterface} from '@/utils/interface';

export interface MusicGetterInterface {
  currentIndex: number;
}
export const currentIndex = (state: MusicStateInterface) => {
  const { currentSong, playlist } = state;
  return playlist.findIndex(({ id }: SongInterface) => id === (currentSong as SongInterface).id);
};
export const nextSong = (state: MusicStateInterface, getters: MusicGetterInterface) => {
  const { playlist, playMode } = state;
  const nextStartMap = {
    [playModeMap.sequence.code]: getSequenceNextIndex,
    [playModeMap.loop.code]: getLoopNextIndex,
    [playModeMap.random.code]: getRandomNextIndex,
  };
  const getNextStart = nextStartMap[playMode];
  const index = getNextStart();

  return playlist[index];

  // 顺序
  function getSequenceNextIndex() {
    let nextIndex = getters.currentIndex + 1;
    if (nextIndex > playlist.length - 1) {
      nextIndex = 0;
    }
    return nextIndex;
  }

  // 随机
  function getRandomNextIndex() {
    return getRandomIndex(playlist, getters.currentIndex);
  }

  // 单曲
  function getLoopNextIndex() {
    return getters.currentIndex;
  }
};
// 上一首歌
export const prevSong = (state: MusicStateInterface, getters: MusicGetterInterface) => {
  const { playlist, playMode } = state;
  const prevStratMap = {
    [playModeMap.sequence.code]: genSequencePrevIndex,
    [playModeMap.loop.code]: getLoopPrevIndex,
    [playModeMap.random.code]: getRandomPrevIndex,
  };
  const getPrevStrat = prevStratMap[playMode];
  const index = getPrevStrat();

  return playlist[index];

  function genSequencePrevIndex() {
    let prevIndex = getters.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1;
    }
    return prevIndex;
  }

  function getLoopPrevIndex() {
    return getters.currentIndex;
  }

  function getRandomPrevIndex() {
    return getRandomIndex(playlist, getters.currentIndex);
  }
};
// 当前是否有歌曲在播放
export const hasCurrentSong = (state: MusicStateInterface) => {
  return isDef((state.currentSong as SongInterface).id);
};
// 获取随机索引
function getRandomIndex(playlist: SongInterface [] , currentIndex: number) {
  // 防止无限循环
  if (playlist.length === 1) {
    return currentIndex;
  }
  let index = Math.round(Math.random() * (playlist.length - 1));
  if (index === currentIndex) {
    index = getRandomIndex(playlist, currentIndex);
  }
  return index;
}
// 获取播放列表是否存在歌曲
function existInList(state: MusicStateInterface) {
  return !!state.playlist.length;
}
