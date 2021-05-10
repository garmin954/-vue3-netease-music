import {defineComponent, reactive, onBeforeMount, computed, shallowReactive, ref} from 'vue';
import {getAllMvs} from '@/api';
import WithPagination from '@/components/with-pagination';
import Tabs from '@/components/base/tabs';
import MvCard from '@/components/mv-card';

const areaTabs = ['全部', '内地', '港台', '欧美', '日本', '韩国'];
const typeTabs = ['全部', '官方版', '原声', '现场版', '网易出品'];
const sortTabs = ['上升最快', '最热', '最新'];

import '@/assets/style/mvs/index.scss'
export default defineComponent({
  name: 'Mvs',
  components: {
    WithPagination,
    Tabs,
    MvCard,
  },
  setup() {

    const pageRef = ref();
    const state = reactive({
      mvs: [],
      mvCount: 0,
      activeAreaTabIndex: 0,
      activeTypeTabIndex: 0,
      activeSortTabIndex: 0,
      activeTab: 0,
    });
    const shallow = shallowReactive({
      areaTabs,
      typeTabs,
      sortTabs,
      getAllMvs: {},
    });

    onBeforeMount(() => {
      shallow.getAllMvs = getAllMvs;
    });

    const onGetMvs = ({ data, count }: any) => {
      state.mvs = data;
      if (count) {
        state.mvCount = count;
      }
    };

    const getDataParams = computed(() => {
      return {
        area: areaTabs[state.activeAreaTabIndex],
        order: sortTabs[state.activeSortTabIndex],
        type: typeTabs[state.activeTypeTabIndex],
      };
    });

    return () => (
      <div class='mvs' ref={pageRef}>
        <div class='tabs-wrap'>
          <span class='tabs-type'>地区：</span>
          <Tabs
            tabs={areaTabs}
            class='tabs'
            type='split'
            active={state.activeAreaTabIndex}
            {...{onTabChange: (index: number) => state.activeAreaTabIndex =index}}
          />
      </div>
      <div class='tabs-wrap'>
        <span class='tabs-type'>类型：</span>
        <Tabs
          tabs={typeTabs}
          class='tabs'
          type='split'
          active={state.activeTypeTabIndex}
          {...{onTabChange: (index: number) => state.activeTypeTabIndex= index}}
        />
      </div>
      <div class='tabs-wrap'>
        <span class='tabs-type'>排序：</span>
        <Tabs
          tabs={sortTabs}
          class='tabs'
          type='split'
          active={state.activeSortTabIndex}
          {...{onTabChange: (index: number) => state.activeSortTabIndex = index}}
        />
      </div>
      <with-pagination
          getData={getAllMvs}
          getDataParams={getDataParams.value}
          limit={40}
          scrollTarget={pageRef}
          total={state.mvCount}
          onGetDataSuccess={onGetMvs}
      >
        <ul class='list-wrap'>
          {
            state.mvs.map((mv: any) => (
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
            ))
          }

      </ul>
      </with-pagination>
  </div>

  );

  },
});
