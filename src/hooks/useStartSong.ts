import {nextTick, Ref, onBeforeMount, shallowRef, computed} from 'vue';
import {useStore} from 'vuex';
import {ElNotification} from 'element-plus';

export default function() {

  const store = useStore();
  const startSongCore = (nextSong: any) => store.dispatch('music/startSong', nextSong);
  const nextSong = computed(() => store.getters['music/nextSong']);

  const startSong = (song: any) => {
    console.log('startSong hooks======>');
    startSongCore(song);

    // 判断是否没有权限播放
    if (!!song.is_vip) {
      ElNotification({
        message: `歌曲【${song.name}】不支持播放！`,
        type: 'warning',
        duration: 3000,
      });

      // 如果只有一首，或者单曲循环就停止播放
      // 自动切换到下一首歌曲
      startSong(nextSong);
    }
  };

  return {startSong};
}
