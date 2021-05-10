import {defineComponent, onMounted, reactive, computed, ref, onUpdated, shallowRef} from 'vue';
import Toggle from '@/components/base/toggle';
import Tabs from '@/components/base/tabs';
import CIcon from '@/components/base/c-icon';
import SongTable from '@/components/song-table';
import {useStore} from 'vuex';

// @ts-ignore
import $style from '@/assets/style/components/paly_list.module.scss';

export default defineComponent({
  name: 'PlayList',
  components: {
    Toggle,
    Tabs,
    CIcon,
    SongTable,
  },
  setup() {
    const tabs = shallowRef(['播放列表', '历史记录']);
    const LIST_TAB = 0;
    const HISTORY_TAB = 1;
    const playlistRef = ref();
    const store = useStore();
    const state: any = reactive({
      activeTab: LIST_TAB,
      reserveDoms: null,
    });

    onMounted(() => {
      state.reserveDoms = [document.getElementById('mini-player')];
    });

    const clear = () => {
      if (isPlaylist.value) {
        clearPlaylist();
      } else {
        clearHistory();
      }
    };


    const setPlaylistShow = (state: boolean) => store.commit('music/setPlaylistShow', state);
    const setPlaylist = (state: boolean) => store.commit('music/setPlaylist', state);

    const clearCurrentSong = () => store.dispatch('music/clearCurrentSong');
    const clearPlaylist = () => store.dispatch('music/clearPlaylist');
    const clearHistory = () => store.dispatch('music/clearHistory');


    const dataSource = computed(() => {
      return isPlaylist.value ? playlist.value : playHistory.value;
    });

    const isPlaylist = computed(() => {
      return state.activeTab === LIST_TAB;
    });

    const isPlaylistShow = computed(() => store.state.music.isPlaylistShow);
    const playlist = computed(() => store.state.music.playlist);
    const playHistory = computed(() => store.state.music.playHistory);

    onUpdated(() => {
      // console.log(isPlaylistShow.value);
    });
    return () => (
      <toggle
        reserveDoms={state.reserveDoms}
        show={isPlaylistShow.value}
      >
        <div
          class={$style.playlist}
          ref={playlistRef}
          style={{display: !!isPlaylistShow.value ? 'block' : 'none'}}
        >
          <Tabs
            tabs={tabs.value}
            align={'center'}
            active={state.activeTab}
            {...{onTabChange: (index: number) => state.activeTab = index}}
          />
          <div class={$style.header}>
            <p class={$style.total}>总共{dataSource.value.length}首</p>
            {(() => {
              if (dataSource.value.length) {
                return (
                  <div
                    onClick={clear}
                    class={$style.remove}
                  >
                    <c-icon type={'remove'} />
                    <span class={$style.text}>清空</span>
                  </div>
                );
              }
            })()}
          </div>
          <>
            {(() => {
              if (dataSource.value.length) {
                return (
                  <div class={$style['song-table-wrap']}>
                    <song-table
                      hideColumns={['index', 'img', 'albumName']}
                      songs={dataSource.value}
                      isPlay={true}
                    />
                  </div>
                );
              } else {
                return (
                  <div class={$style.empty}>你还没有添加任何歌曲</div>
                );
              }
            })()}
          </>
        </div>

      </toggle >
    );
  },
});
