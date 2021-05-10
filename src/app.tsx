import {defineComponent, onMounted, createSlots, h} from 'vue';
import {useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate} from 'vue-router';
import OriginalConfirm, {confirm} from './components/confirm';
import {mapActions, useStore} from 'vuex';
import Layout from '@/views/layout/index';
import CButton from '@/components/base/c-button';
import MiniPlayer from '@/components/mini-player';
import Player from '@/components/player';
import PlayList from '@/components/playlist';

import '@/assets/style/app.module.scss';

export default defineComponent({
  name: 'App',
  components: {
    OriginalConfirm,
    'c-button': CButton,
    Layout,
    MiniPlayer,
    PlayList

  },
  setup(props, {slots}) {

    const router = useRouter();
    router.onError((error:any) => {
      const pattern = /Loading chunk (\d)+ failed/g;
      const isChunkLoadFailed = error.message.match(pattern);
      if (isChunkLoadFailed) {
        window.location.reload();
        // router.replace(router.history.pending.fullPath);
      }else{
        console.log(error)
      }
    });

    onMounted(() => {
      const store = useStore();
      // const {startSong, addToPlaylist} = {...mapActions(['startSong', 'addToPlaylist'])};
      // console.log(slots.default?.());
      // confirm('提醒', '余额不足', () => {});
    });
    // onBeforeRouteLeave((to, from) => {
    //   const answer = window.confirm(
    //     'Do you really want to leave? you have unsaved changes!',
    //   );
    //   // 取消导航并停留在同一页面上
    //   if (!answer) {
    //     return false;
    //   }
    // });
    //
    // // 与 beforeRouteLeave 相同，无法访问 `this`
    // onBeforeRouteUpdate(async (to, from) => {
    //   // 仅当 id 更改时才获取用户，例如仅 query 或 hash 值已更改
    //   if (to.params.id !== from.params.id) {
    //   }
    // });



    const handleClick = (e:any) => {
      // console.log('sds', e);
    };
    return () =>  (
      <>
        <Layout/>
        <Player/>
        <MiniPlayer/>
        <original-confirm />
        <PlayList/>
      </>
    );
  },
});
