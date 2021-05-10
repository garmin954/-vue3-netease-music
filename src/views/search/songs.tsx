import {defineComponent, reactive, computed, inject, onMounted, toRaw, toRefs, shallowReactive} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import HighlightText from '@/components/base/highlight-text';
import WithPagination from '@/components/with-pagination';
import SongTable from '@/components/song-table';
import {getSearch} from '@/api';
import {createSong} from '@/utils';
import '@/assets/style/layout/songs.scss';
export default defineComponent({
  name: 'SearchSongs',
  components: {
    WithPagination,
    SongTable,
    HighlightText,
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      songCount: 0,
      currentPage: 1,
      getSearch: {},
    });
    const _state = shallowReactive({
      songs: [],
    });

    onMounted(() => {
      // const {params: {keywords}}: any = route;
      // state.getSearch = getSearch({keywords});
    });

    const searchRoot = inject('searchRoot');
    const onGetSearch = (result: any) =>  {
      const {result: { songs, songCount }} = result;
      _state.songs = songs.map((song: any) => {
        const { id, mvid, name, alias, artists, duration, album, fee } = song;
        return createSong({
          id,
          name,
          alias,
          artists,
          duration,
          mvId: mvid,
          albumName: album.name,
          albumId: album.id,
          fee
        });
      });

      state.songCount = songCount;
      (searchRoot as any).ctx.onUpdateCount(songCount);
    };
    const renderNameDesc = (scope: any) =>  {
      const { alias } = scope.row;
      return alias.map((desc: any) => (
        <HighlightText
          class='name-desc'
          text={desc}
          highlightText={keywords}
        />
      ));
    };

    const keywords = computed(() => {
      return (searchRoot as any).props.keywords;
    });
    const searchParams = computed(() => {
      return { keywords: keywords.value };
    });


    return () => (
      <div class='search-songs'>
        <with-pagination
          getData={getSearch}
          getDataParams={searchParams.value}
          limit={30}
          scrollTarget={(searchRoot as any).$refs && (searchRoot as any).$refs.header}
          total={state.songCount}
          onGetDataSuccess={onGetSearch}
        >
          <div class='table'>
            <song-table
              highlightText={keywords.value.toString()}
              renderNameDesc={renderNameDesc}
              songs={_state.songs}
              stripe={true}
            />
          </div>
        </with-pagination>
    </div>
    );
  },
});
