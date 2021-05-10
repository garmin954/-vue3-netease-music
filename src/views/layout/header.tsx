import {defineComponent, computed, useCssModule, onMounted, getCurrentInstance} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import Search from '@/components/search';
import CIcon from '@/components/base/c-icon';
import RoutesHistory from '@/components/routes-history';
import Theme from '@/components/theme';
import {exitFullscreen, isFullscreen, requestFullScreen} from '@/utils';

export default defineComponent({
  name: 'LayoutHeader',
  components: {
    Search,
    CIcon,
    RoutesHistory,
    Theme,
  },
  __cssModules: {
    header: require('@/assets/style/layout/header.module.scss'),
  },
  setup() {
    const router = useRouter();
    const $style = useCssModule('header');
    const store = useStore();

    const onClickLogo = () => {
      router.push({path: '/discovery'});
    };

    const fullscreen = () => {
      requestFullScreen(document.documentElement);
    };

    const onClickDown = () => {
      setPlayerShow();
    };

    // const toggleFullscreen = () => {
    //   isFullscreen = !isFullscreen
    // }
    const _exitFullscreen = () => {
      if (isFullscreen()) {
        exitFullscreen();
      }
    };
    const isPlayerShow = computed(() => store.state.music.isPlayerShow);
    const setPlayerShow = () => store.commit('music/setPlayerShow', false);

    return () => (
      <div class={$style.header}>
        <div class={$style.left}>
          <div class={$style.buttons}>
            <div onClick={onClickLogo} class={[$style['mac-button'], $style.red]}>
                <CIcon size={9} type={'home'}/>
            </div>
            <div onClick={_exitFullscreen} class={[$style['mac-button'], $style.yellow]}>
              <CIcon size={9} type={'minus'}/>
            </div>
            <div onClick={fullscreen} class={[$style['mac-button'], $style.green]}>
              <CIcon size={9} type={'fullscreen'}/>
            </div>
          </div>
          {(() => {
            if (!!isPlayerShow.value) {
              return (
                <div onClick={onClickDown} class={$style['shrink-player']}>
                  <CIcon backdrop={true} type={'down'}/>
                </div>
              );
            }
          })()}


          <div class={$style.history} style={{display: !isPlayerShow.value ? 'block' : 'none'}}>
            <RoutesHistory />
          </div>
        </div>
        <div class={$style.right}>
          <div class={$style['search-wrap']}>
            <Search />
          </div>
          <Theme />
        </div>
      </div>
    );
  },
});
