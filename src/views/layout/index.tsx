import {defineComponent, computed, useCssModule} from 'vue';
import {useRoute, useRouter, RouterView} from 'vue-router';
import {useStore} from 'vuex';

import LayoutHeader from '@/views/layout/header';
import LayoutMenu from '@/views/layout/menu';
import { layoutCenterNames } from '@/router';

export default defineComponent({
  name: 'Layout',
  components: {
    LayoutHeader,
  },
  __cssModules: {
    index: require('@/assets/style/layout/index.module.scss'),
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const $style = useCssModule('index');

    const routerViewCls = computed(() => {
      return layoutCenterNames.find((name) => name === route.name)
        ? 'router-view-center'
        : '';
    });

    const isMenuShow = computed(() => store.dispatch('music/isMenuShow'));

    return () => (
      <div class={$style.layout}>
        <LayoutHeader />
        <div class={$style['layout-body']}>
          <div class={$style['layout-menu']} >
            <LayoutMenu />
          </div>
          <div class={$style.content} id='page-content'>
            <RouterView class={routerViewCls.value} />
          </div>
        </div>
      </div>
    );
  },
});
