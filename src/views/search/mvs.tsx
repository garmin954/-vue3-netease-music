import {defineComponent, reactive, computed, inject, onMounted} from 'vue';
import WithPagination from '@/components/with-pagination';
import MvCard from '@/components/mv-card';
import {getSearch} from '@/api';

import '@/assets/style/search/mvs.scss';
export default defineComponent({
  name: 'SearchMvs',
  components: {
    WithPagination,
    MvCard,
  },
  setup() {
    const SEARCH_TYPE_MV = 1004;
    const searchRoot = inject('searchRoot');
    const state = reactive({
      mvs: [],
      mvCount: 0,
    });

    onMounted(() => {
      // this.getSearch = getSearch
    });
    const onGetMvs = ({result: {mvs, mvCount}}: any) => {
      state.mvs = mvs;
      state.mvCount = mvCount
      (searchRoot as any).onUpdateCount(mvCount);
    };

    const searchParams = computed(() => {
      return {keywords: (searchRoot as any).ctx.keywords, type: SEARCH_TYPE_MV};
    });

    return () => (
      <div class='search-mvs'>
        <with-pagination
          getData={getSearch}
          getDataParams={searchParams.value}
          limit={40}
          scrollTarget={(searchRoot as any).$refs && (searchRoot as any).$refs.header}
          total={state.mvCount}
          onGetDataSuccess={onGetMvs}
        >
          <ul class='list-wrap'>
            {
              state.mvs.map((mv: any) => {

                return (
                  <li
                    key={mv.id}
                    class='list-item'
                  >
                    <mv-card
                      author={mv.artistName}
                      duration={mv.duration}
                      id={mv.id}
                      img={mv.cover}
                      name={mv.name}
                      playCount={mv.playCount}
                    />
                  </li>
                );
              })
            }

          </ul>
        </with-pagination>
      </div>
    );
  },
});
