import { isDef, playModeMap } from '@/utils';
import {ElNotification} from 'element-plus';

export const currentIndex = (state: any) => {
  const { currentSong, playlist } = state;
  return playlist.findIndex(({ id }: any) => id === currentSong.id);
};

export const nextSong = (state: any, getters: any) => {
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
export const prevSong = (state: any, getters: any) => {
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
export const hasCurrentSong = (state: any) => {
  return isDef(state.currentSong.id);
};

// 获取随机索引
function getRandomIndex(playlist: any, currentIndex: number) {
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

function VipAuthTip({is_vip, name}:any){
  if (is_vip){
    ElNotification({
      message: `歌曲【${name}】不支持播放！`,
      type: 'warning',
      duration: 3000,
    });
    return true;
  }

  return false;
}
