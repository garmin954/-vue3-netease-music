import {defineComponent, ref, computed, h, useCssModule} from 'vue';
import {RouterLink} from 'vue-router';
import {useStore} from 'vuex';
import CIcon from '@/components/base/c-icon';
import {menuRoutes} from '@/router';

// @ts-ignore
import $style from '@/assets/style/layout/menu.module.scss'
export default defineComponent({
  name: 'LayoutMenu',
  components: {
    CIcon,
  },
  setup() {
    const store = useStore();
    const menus = ref<any []>([
      {
        type: 'root',
        children: menuRoutes,
      },
    ]);

    const userPlaylist = (() => {
      return store.state.user.userPlaylist;
    });
    const isLogin = (() => {
      return store.getters.user.isLogin;
    });
    const userMenus = ((): any [] => {
      return store.getters.user.userMenus || [];
    });

    const menusWithPlaylist = computed(() => {
      return isLogin && userMenus.length
        ? menus.value.concat(userMenus)
        : menus;
    });

    return{
      menusWithPlaylist,
    };
  },

  render(data: any) {
    const {menusWithPlaylist} = data;
    const menu = menusWithPlaylist.value.map((menu: any, index: number ) => (
      <div key={index} class={$style['menu-block']}>
        {(() => {
          if (!!menu.title) {
            return (<p class={$style['menu-block-title']}>{ menu.title }</p>);
          }
        })()}
        <ul class={$style['menu-list']}>
          {menu.children.map((item: any, index: number) => (
            <router-link
              key={index}
              to={item.path}
              activeClass={'menu-item-active'}
            >
              {{
                default: () => (
                  <li class={$style['menu-item']}>
                    <c-icon size={16} type={item.meta.icon} class={$style.iconfont} />
                    <span class={$style['menu-title']}>{ item.meta.title }</span>
                  </li>
                ),
              }}
            </router-link>
          ))}
        </ul>
      </div>
    ));
    return (
      <div class={$style.menu}>
        <user />
        <div class={$style['menu-wrap']}>
          {menu}
        </div>
      </div>
    );
  },
});
