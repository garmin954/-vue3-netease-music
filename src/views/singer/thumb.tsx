import {defineComponent, onMounted, reactive} from 'vue';
import {useRoute} from 'vue-router';
import {getAllMvs, getArtistAlbum} from '@/api';
import Thumb from '@/components/thumb';
import SimplePagination from '@/components/simple-pagination';

export default defineComponent({
  name: 'SingerThumb',
  components: {
    Thumb,
    SimplePagination,
  },
  setup() {
    const route = useRoute();
    const state = reactive({
      id: 0,
      hotAlbums : [],
      limit: 20,
      offset: 0,
    }as any);

    onMounted(async () => {
      state.id = route.params.id;
      // const {hotAlbums} = await getArtistAlbum({id: state.id, limit: state.limit, offset: state.offset});
      // console.log('hotAlbums', hotAlbums);
      // state.hotAlbums = hotAlbums;
    });

    const onGetArtistAlbum = (result: any) => {
      const {hotAlbums} = result;
      // console.log('hotAlbums==========>', hotAlbums);
      state.hotAlbums = hotAlbums;
    };
    return () => (
      <div>
        {state.id ? (

          <simple-pagination
            getData={getArtistAlbum}
            getDataParams={{id: state.id}}
            limit={20}
            onGetDataSuccess={onGetArtistAlbum}
          >
            {{
              lists: () => (
                <Thumb
                  list={state.hotAlbums}
                />
              ),
            }}

          </simple-pagination>
        ): null}
      </div>
    );
  },
});
