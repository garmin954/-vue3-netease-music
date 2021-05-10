import {defineComponent, onMounted, ref} from 'vue';
import {ElPopover} from 'element-plus';
import Cookies from 'js-cookie';
import CIcon from '@/components/base/c-icon';

import '@/assets/style/components/theme.scss'

// @ts-ignore
import variables from '@/assets/style/themes/variables';
// @ts-ignore
import variablesWhite from '@/assets/style/themes/variables-white';
// @ts-ignore
import variablesRed from '@/assets/style/themes/variables-red';
const THEME_KEY = '__theme__';
const themes = {
  white: 'white',
  dark: 'dark',
  red: 'red',
};
export default defineComponent({
  name: 'Theme',
  components: {
    ElPopover,
    CIcon,
  },
  setup() {
    const visible = ref<boolean>(false);
    const themeMap = ref<any>({});
    onMounted(() => {
      themeMap.value = {
        [themes.dark]: {
          title: '深色',
          file: variables,
          style: {
            backgroundColor: '#202020',
          },
        },
        [themes.white]: {
          title: '浅色',
          file: variablesWhite,
          style: {
            backgroundColor: '#F6F6F6',
            border: '1px solid #EBEAEA',
          },
        },
        [themes.red]: {
          title: '红色',
          file: variablesRed,
          style: {
            backgroundColor: '#D33A31',
          },
        },
      };
      // 默认浅色
      changeTheme(Cookies.get(THEME_KEY) || themes.white);
    });

    const changeTheme = (themeKey: any) => {
      Cookies.set(THEME_KEY, themeKey);
      const theme = themeMap.value[themeKey].file;
      Object.keys(theme).forEach((key) => {
        const value = theme[key];
        document.documentElement.style.setProperty(key, value);
      });
    };

    return () => (
      <div class='theme'>
        <el-popover
          placement={'top'}
          {...{"onUpdate:visible": (e: any) => visible.value = e}}
          width={'230'}
        >
          {{
            default: () => (
              <div class='themes'>
                {(() => {
                  const template = [];
                  for (const index in themeMap.value) {
                    const themeValue = themeMap.value[index];
                    template.push(
                      <div key={index} onClick={() => changeTheme(index)} class='theme-item'>
                        <div style={themeValue.style} class='theme-icon'/>
                        <p>{themeValue.title}</p>
                      </div>,
                    );
                  }
                  return template;
                })()
                }
              </div>
            ),
            reference: () => (<CIcon backdrop={true} type={'skin'} />),
          }}


        </el-popover>
      </div>
    );
  },
});
