import {defineComponent, reactive, onBeforeMount, ref, shallowRef} from 'vue';
import {getPlaylists, getTopPlaylists, PlaylistInterface } from '@/api';
import Tabs from '@/components/base/tabs';
import TopPlaylistCard from '@/components/top-playlist-card.tsx';
import PlaylistCard from '@/components/playlist-card.tsx';
import {ElPagination} from 'element-plus';

import '@/assets/style/playlists/index.scss'

import {getPageOffset, scrollInto, formatNumber} from '@/utils';
export default defineComponent({
  name: 'PlayLists',
  components: {
    Tabs,
    TopPlaylistCard,
    PlaylistCard,
    ElPagination,
  },
  setup() {
    const playlistsRef = ref();
    const state = reactive({
      activeTabIndex: 0,
      playlists: [],
      currentPage: 0,
      total: 0,
      topPlaylist: {} as any,
    });
    const PAGE_SIZE = 50;
    const tabs = shallowRef([
      '全部',
      '欧美',
      '华语',
      '流行',
      '说唱',
      '摇滚',
      '民谣',
      '电子',
      '轻音乐',
      '影视原声',
      'ACG',
      '怀旧',
      '治愈',
      '旅行',
    ]);
    onBeforeMount(() => {
      initData();
    });


    // 获取歌单和精品歌单
    const initData = async () => {
      getPlaylistsRes();
      getTopPlaylistsRes();
    };

    const getPlaylistsRes = async () => {
      const { playlists, total } = await getPlaylists({
        limit: PAGE_SIZE,
        offset: getPageOffset(state.currentPage, PAGE_SIZE),
        cat: tabs.value[state.activeTabIndex],
      });
      state.playlists = playlists;
      state.total = total;
    };
    const getTopPlaylistsRes = async () => {
      const { playlists } = await getTopPlaylists({
        limit: 1,
        cat: tabs.value[state.activeTabIndex],
      });
      state.topPlaylist = playlists[0] || {};
    };
    // 分页只重新获取歌单
    const onPageChange = async (page: number) => {
      state.currentPage = page;
      getPlaylistsRes();
      scrollInto(playlistsRef.value);
    };
    const onTabChange = (index: number) => {
      state.activeTabIndex = index;
      initData();
    };

    return () => (
      <div class='playlists' ref={playlistsRef}>
        {(()=>{

          if (state.topPlaylist.id){
            return (
              <div class='top-play-list-card'>
                <top-playlist-card
                  desc={state.topPlaylist.description}
                  id={state.topPlaylist.id}
                  img={state.topPlaylist.coverImgUrl}
                  name={state.topPlaylist.name}
                />
              </div>
            )
          }
        })()}

      <div class='tabs'>
        <Tabs
          tabs={tabs.value}
          align='right'
          type='small'
          active={state.activeTabIndex}
          {...{onTabChange: onTabChange}}
        />
      </div>
      <div class='playlist-cards'>

        {
          state.playlists.map((item:any)=>(
            <PlaylistCard
              desc={`播放量：${formatNumber(item.playCount)}`}
              id={item.id}
              img={item.coverImgUrl}
              key={item.id}
              name={item.name}
            />
          ))
        }

      </div>
      <el-pagination
        currentPage={state.currentPage}
        pageSize={PAGE_SIZE}
        total={state.total}
        onCurrentChange={onPageChange}
        class="pagination"
      />
    </div>
    );
  },
})
