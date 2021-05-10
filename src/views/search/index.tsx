import {defineComponent, provide, getCurrentInstance, onMounted, ref, computed, useCssModule} from 'vue';
import {RouterView, useRoute} from 'vue-router';
import {useStore, mapActions} from 'vuex';
import Tabs from '@/components/base/tabs';
import Empty from '@/components/base/empty';
// import '@/assets/style/search/index.scss';
import router from '@/router';
// @ts-ignore
import $style from '@/assets/style/search/index.module.scss';
const tabs = [
  {
    title: '歌曲',
    key: 'songs',
    to: 'songs',
  },
  {
    title: '歌单',
    key: 'playlists',
    to: 'playlists',
  },
  {
    title: 'MV',
    key: 'mvs',
    to: 'mvs',
  },
];
export default defineComponent({
  name: 'Search',
  // __cssModules: {search: style},
  props: {
    keywords: {
      type: String,
      default: '',
    },
  },
  components: {
    // Tabs,
    // Empty,
    RouterView,
  },
  setup(props) {
    provide('searchRoot', getCurrentInstance());
    // const $style = useCssModule('search');
    const store = useStore();
    const route = useRoute();
    const header = ref();
    const count = ref<number>(0);

    onMounted(() => {
      // console.log($style);
    });

    const onUpdateCount = (_count: number) => {
      count.value = _count;
    };

    const showEmpty = computed(() => {
      return !axiosLoading && count.value === 0;
    });

    const key = computed(() => {
      return route.fullPath;
    });

    const axiosLoading = computed(() => store.state.axiosLoading);
    return {
      header,
      props,
      count,
      showEmpty,
      key,
      onUpdateCount,
      // style:$style,
    };

  },
  render(data: any) {
    const {header, props, count, showEmpty, key} = data;

    return (
      <div class={$style['search-detail']}>
        <div class={$style.header} ref={header}>
          <span class={$style.keywords}>{props.keywords}</span>
          <span class={$style.found}>找到<b>{count}</b>个结果</span>
        </div>
        <div class={$style['tabs-wrap']}>
          <Tabs
            tabs={tabs}
            class='tabs'
            type='split'
            itemClass={'search-tab-item'}
          />
        </div>
        {/*<Empty class={$style.empty} empty={!!showEmpty}></Empty>*/}
        <router-view key={key} />
      </div>
    );
  },
});
