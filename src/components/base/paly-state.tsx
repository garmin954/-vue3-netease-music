import {defineComponent, onMounted, ref, watch} from 'vue';
import {useStore} from 'vuex';
import { pad, goMvWithCheck, genImgUrl, formatTime } from '@/utils';

import '@/assets/style/components/base/play-state.scss';
export default defineComponent({
  name: 'PlayState',
  props: {
    id: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore();
    const template = ref();
    // 是否当前的歌曲
    const isActiveSong = () => {
      return props.id === store.state.music.currentSong.id;
    };


    onMounted(() => {
      initTemplate();
    });

    watch(()=> store.state.music.currentSong.id, ()=>{
      initTemplate()
    })

    const initTemplate = () => {
      if (isActiveSong()) {
        template.value = (
          <div class='audio-icon'>
            <div class='column' style='animation-delay: -1.2s;'/>
            <div class='column'/>
            <div class='column' style='animation-delay: -1.5s;'/>
            <div class='column' style='animation-delay: -0.9s;'/>
          </div>
        );
      }else{
        template.value = <span>{pad(props.index + 1)}</span>;
      }
    };

    return () => template.value;
  },
});
