import {defineComponent, computed, reactive, watch, ref, onUpdated} from 'vue';
import {getListDetail, getSongDetail} from '@/api';
import {useRoute} from 'vue-router';
import {createSong, scrollInto} from '@/utils';
import Tabs from '@/components/base/tabs';
import PlaylistDetailHeader from '@/views/playlist-detail/header';
import SongTable from '@/components/song-table';
import Comments from '@/components/comments.tsx';
import {ElInput} from 'element-plus';
import useLoading from '@/hooks/useLoading';

import '@/assets/style/playlist-detail/index.scss';
const MAX = 500;
const SONG_IDX = 0;
const COMMENT_IDX = 1;
export default defineComponent({
  name: 'PlayListDetail',
  components: {
    PlaylistDetailHeader,
    Tabs,
    ElInput,
    SongTable,
    Comments,
  },
  setup(props) {
    const route = useRoute();
    const headerRef = ref();
    const state = reactive({
      tabs: ['歌曲列表', '评论'],
      activeTab: SONG_IDX,
      playlist: {},
      songs: [],
      searchValue: '',
      inputFocus: false,
    });

    console.log(useLoading());
    // 获取数据
    const init = async () => {
      const { playlist } = await getListDetail({ id: id.value });
      state.playlist = playlist;
      genSonglist(playlist);
    };

    // 生成歌曲列表
    const genSonglist = async (playlist: any) => {
      const trackIds = playlist.trackIds.map((item: any ) => item.id);
      const songDetails = await getSongDetail(trackIds.slice(0, MAX));
      const songs = songDetails.songs.map(({ id, name, al, ar, mv, dt ,fee}: any) =>
        createSong({
          id,
          name,
          artists: ar,
          duration: dt,
          mvId: mv,
          albumName: al.name,
          img: al.picUrl,
          fee

        }),
      );
      state.songs = songs;
    };

    // 评论列表
    const onCommentsUpdate = ({ total }: any) => {
      state.tabs.splice(COMMENT_IDX, 1, `评论(${total})`);
    };


    const onInputFocus = () => {
      state.inputFocus = true;
    };

    const onInputBlur = () => {
      state.inputFocus = false;
    };

    const getInputCls = () => {
      return !state.inputFocus ? 'inactive input' : 'input';
    };

    const scrollToHeader = () => {
      console.log(headerRef.value, 'headerRef.value=========>');
      if (headerRef.value) {
        // scrollInto(headerRef.value.$el);
      }
    };
    // 获取歌单id
    const id = computed(() => {
      return Number(route.params.id);
    });

    // 过滤非搜索的音乐
    const filteredSongs = computed(() => {
      return state.songs.filter(({ name, artistsText, albumName }) =>
        `${name}${artistsText}${albumName}`
          .toLowerCase()
          .includes(state.searchValue.toLowerCase()),
      );
    });

    watch(() => id.value, () => {
      state.searchValue = '';
      init();
      scrollToHeader();
    }, {immediate: true});

    if (state.playlist) {
      return () => (
        <div class='playlist-detail'>
          <playlist-detail-header ref={headerRef} playlist={state.playlist} songs={state.songs} />
          <div class='tabs-wrap'>
            <Tabs
              tabs={state.tabs}
              type='theme'
              active={state.activeTab}
              {...{onTabChange: (index: number) => state.activeTab = index}}
            />
            <el-input
              class={getInputCls()}
              blur={onInputBlur}
              focus={onInputFocus}
              placeholder='搜索歌单音乐'
              prefixIcon='el-icon-search'
              modelValue={state.searchValue}
              {...{'onUpdate:modelValue': (val: string) => state.searchValue = val}}
              style={{display: state.activeTab === SONG_IDX ? 'block' : 'none'}}
            />
          </div>

          {(() => {
            if (state.searchValue && !filteredSongs.value.length) {
              return (
                <div class='empty'>
                  未能找到和
                  <span class='keyword'>“{ state.searchValue }”</span>
                  相关的任何音乐
                </div>
              );
            }
          })()}

          <song-table
            highlightText={state.searchValue}
            songs={filteredSongs.value}
            class='table'
            style={{display: state.activeTab === SONG_IDX ? 'block' : 'none'}}
          />
          <div class='comments'   style={{display: state.activeTab === COMMENT_IDX ? 'block' : 'none'}}>
            <comments
              id={id.value}
              onUpdate={onCommentsUpdate}
              type='playlist'
            />
          </div>
      </div>
    );
  }
  },

});
