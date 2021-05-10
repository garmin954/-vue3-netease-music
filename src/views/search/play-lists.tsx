import {defineComponent, reactive, computed, inject, onMounted} from 'vue';
import {getSearch} from '@/api';
import PlaylistCard from '@/components/playlist-card';
import WithPagination from '@/components/with-pagination';
import MvCard from '@/components/mv-card';
import {formatNumber} from '@/utils';

import '@/assets/style/search/playlists.scss'
export default defineComponent({
  name: 'SearchPlayLists',
  components: {
    WithPagination,
    MvCard,
    PlaylistCard,
  },
  setup() {
    const SEARCH_TYPE_PLAYLIST = 1000;
    const searchRoot = inject('searchRoot');
    const state = reactive({
      playlists: [],
      playlistCount: 0,
    });

    onMounted(() => {
      // this.getSearch = getSearch
    });
    const onGetPlaylists = ({result: {playlists, playlistCount}}: any) => {
      state.playlists = playlists;
      state.playlistCount = playlistCount
      (searchRoot as any).onUpdateCount(playlistCount);
    };

    const searchParams = computed(() => {
      return {keywords: (searchRoot as any).ctx.keywords, type: SEARCH_TYPE_PLAYLIST};
    });


    return () => (
      <div class='search-playlists'>
        <with-pagination
          getData={getSearch}
          getDataParams={searchParams.value}
          limit={50}
          scrollTarget={(searchRoot as any).$refs && (searchRoot as any).$refs.header}
          total={state.playlistCount}
          onGetDataSuccess={onGetPlaylists}
        >
          <div class='list-wrap'>
            {
              state.playlists.map((item: any) => {
                return (
                  <playlist-card
                    desc={`播放量：${formatNumber(item.playCount)}`}
                    id={item.id}
                    img={item.coverImgUrl}
                    key={item.id}
                    name={item.name}
                  />
                );
              })
            }

          </div>
        </with-pagination>
      </div>
    );
  },
});
