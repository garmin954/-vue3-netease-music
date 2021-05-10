import {defineComponent, onMounted, computed, reactive, h} from 'vue';
import {useRouter, useRoute, useLink, RouterLink, RouteLocation} from 'vue-router';

// @ts-ignore
import $style from '@/assets/style/components/base/tabs.module.scss';
import { isDef } from '@/utils';

interface TabsInterface {
  title: string;
  key: string;
  to: string;
}
const ACTIVE_PROP = 'active';
const ACTIVE_CHANGE = 'tabChange';
const ROUTE_ACTIVE_CLS = 'active';
export default defineComponent({
  name: 'Tabs',
  components: {
    RouterLink,
  },
  props: {
    [ACTIVE_PROP]: {
      type: Number,
      default: 0,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    align: {
      type: String,
      default: 'left',
    },
    itemStyle: {
      type: Object,
      default: () => ({}),
    },
    activeItemStyle: {
      type: Object,
      default: () => ({}),
    },
    itemClass: {
      type: String,
    },
    activeItemClass: {
      type: String,
      default: '',
    },
    // 不传的话对应大号字体 高亮加粗
    // small对应小号字体 高亮红色
    // split对应小号字体 分割线分隔 高亮背景色变灰文字变红
    type: {
      type: String,
    },
  },

  emits: [ACTIVE_CHANGE],
  setup(props, {emit}) {

    onMounted(() => {
      // ROUTE_ACTIVE_CLS = ROUTE_ACTIVE_CLS
    });
    const router = useRouter();
    const route = useRoute();

    const isRouteMode = computed(() => {
      return props.tabs.length && isDef((props.tabs[0] as any).to);
    });
    const normalizedTabs = computed(() => {
      return  props.tabs[0] instanceof String
        ? props.tabs.map((tab) => ({ title: tab }))
        : props.tabs;
    });

    const  onChangeTab = (tab: TabsInterface, index: number) => {
      if (isRouteMode.value) {
        router.push(tab.to);
      } else {
        emit(ACTIVE_CHANGE, index);
      }
    };
    const isActive = (tab: TabsInterface, index: number) => {
      // 路由模式
      if (isRouteMode.value) {
        const { fullPath } = router.resolve(tab.to) as RouteLocation;
        return fullPath === route.path;
      } else {
        return index === props[ACTIVE_PROP];
      }
    };

    const getItemCls = (tab: TabsInterface, index: number) => {
      const base = ['tab-item'];
      if (props.itemClass) {
        base.push(props.itemClass);
      }
      if (props.type) {
        base.push(props.type);
      }
      if (isActive(tab, index)) {
        if (props.activeItemClass) {
          base.push(props.activeItemClass);
        }
        base.push('active');
      }

      const cls: any = [];
      base.forEach((item) => {
        cls.push($style[item]) ;
      });

      return cls.join(' ');
    };

    const  getItemStyle = (tab: TabsInterface, index: number) => {
      return Object.assign(
        {},
        props.itemStyle,
        isActive(tab, index)
          ? Object.assign({}, props.activeItemStyle)
          : null,
      );
    };

    const tabItem = () => {
      if (isRouteMode.value) {
        return normalizedTabs.value.map((tab: any, index: number) => (
          <li class={getItemCls(tab, index)}>
          <router-link
            activeClass={getItemCls(tab, index)}
            key={index}
            style={getItemStyle(tab, index)}
            to={tab.to}
          >
            <span class={$style.title}>{tab.title}</span>
          </router-link>
          </li>
        ));
      } else {
        return normalizedTabs.value.map((tab: any, index: number) => {
          if (tab instanceof Object){
            index = tab.type;
            tab = tab.title;
          }

          return (
            <li class={getItemCls(tab, index)}
                key={index}
                style={getItemStyle(tab, index)}
                onClick={() => onChangeTab(tab, index)}
            >
              <span class={$style.title}>{tab}</span>
            </li>
          )
        });
      }
    };

    return() => (
      <ul class={{[$style[props.align]]: true, [$style['tab-wrap']]: true}}>
        {tabItem()}
      </ul>
    );
  },
});
