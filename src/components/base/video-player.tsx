import {defineComponent, ref, onMounted, watch, onUpdated, nextTick} from 'vue';
import {toRem} from '@/utils';
// import Player from 'xgplayer';
export default defineComponent({
  name: 'VideoPlayer',
  props: ['url', 'poster'],
  setup(props, {expose}) {
    const playerRef = ref();
    const playerInstance = ref();
    onMounted(() => {
      initPlayer();
      transferRem();
    });
    const Player = require('xgplayer');
    const initPlayer = () => {
      if (!props.url) { return; }
      playerInstance.value = new Player({
        el: playerRef.value,
        url: props.url,
        poster: props.poster,
        videoInit: true,
        lang: 'zh-cn',
        width: '100%',
      });
    };



    const transferRem = () => {
      playerInstance.value.on('ready', () => {
        const videoWrapper = playerRef.value;
        const height = videoWrapper.style.height;
        const remHeight = toRem(Number(height.replace('px', '')));
        videoWrapper.style.height = remHeight;
      });
    };

    const getPlayerInstance = () => {
      return playerInstance.value;
    };
    watch(() => props.url, (url, oldUrl) => {
      if (url && url !== oldUrl) {
        if (!playerInstance.value) {
          initPlayer();
        } else {
          initPlayer();
          nextTick(() => {
            playerInstance.value.src = url;
            playerInstance.value.reload();
          });
        }
      }
    });

    expose({getPlayerInstance});
    return () => (<div class='video-player' ref={playerRef}> </div>);
  },
});
