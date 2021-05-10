import {defineComponent, reactive, computed, inject, onMounted, toRaw, toRefs, shallowReactive, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import HighlightText from '@/components/base/highlight-text';
import WithPagination from '@/components/with-pagination';
import SongTable from '@/components/song-table';
import {getArtists} from '@/api';
import {createSong} from '@/utils';
import '@/assets/style/layout/songs.scss';
export default defineComponent({
  name: 'SingerSongs',
  components: {
    WithPagination,
    SongTable,
    HighlightText,
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      id: 0,
      songCount: 0,
      currentPage: 1,
      getSearch: {},
      hotSongs: [],
    }as any);


    onMounted(() => {
      state.id = route.params.id;
      getArtistsReq();
    });

    watch(() => route, () => {
      state.id = route.params.id;
    }, {deep: true});

    watch(() => state.id, () => {
      getArtistsReq();
    });

    const getArtistsReq = async () => {
      const {hotSongs} = await getArtists(state.id);
      state.hotSongs = hotSongs.map((song: any) => {
        const { id, mv, name, alia, ar, dt, al, fee } = song;
        return createSong({
          id,
          name,
          alias: alia,
          artists: ar,
          duration: dt,
          mvId: mv,
          albumName: al.name,
          albumId: al.id,
          fee,
        });
      });
    };

    return () => (
      <div >
        <div class='table'>
          <song-table
            songs={state.hotSongs}
            stripe={true}
          />
        </div>
      </div>
    );
  },
});
