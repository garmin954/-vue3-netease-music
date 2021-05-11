import {defineComponent, onMounted, reactive} from 'vue';
import {useRoute} from 'vue-router';
import {getArtistsMv} from '@/api';
import SimplePagination from '@/components/simple-pagination';
import MvCard from '@/components/mv-card';
import '@/assets/style/singer/mv.scss';

export default defineComponent({
  name: 'SingerMv',
  components: {
    SimplePagination,
    MvCard,
  },
  setup() {
    const route = useRoute();
    const state = reactive({
      id: 0,
      mvs: [],
    } as any);

    onMounted(() => {
      state.id = route.params.id;
      // getArtistsMv(state.id);
    });
    const onGetArtistMv = (result: any) => {
      const {mvs} = result;
      // console.log('hotAlbums==========>', mvs);
      state.mvs = mvs;
    };
    return () => (
      <div>
        {state.id ? (
          <simple-pagination
            getData={getArtistsMv}
            getDataParams={{id: state.id}}
            limit={20}
            more={'hasMore'}
            onGetDataSuccess={onGetArtistMv}
          >
            {{
              lists: () => {
                return (
                  <ul class='list-wrap'>
                    {
                      state.mvs.map((mv: any) => {
                        return (
                          <li
                            key={mv.id}
                            class={'list-item'}
                          >
                            <mv-card
                              author={mv.artistName}
                              id={mv.id}
                              img={mv.imgurl}
                              name={mv.name}
                              playCount={mv.playCount}
                            />
                          </li>
                        );
                      })
                    }
                  </ul>
                );
              },
            }}
          </simple-pagination>
        ): null}
      </div>
    );
  },
});
