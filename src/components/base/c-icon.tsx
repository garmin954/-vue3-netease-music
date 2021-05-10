import {defineComponent, onUpdated, computed} from 'vue';
import { toRem } from '@/utils';

import '@/assets/style/components/c-icon.scss';
export default defineComponent({
  name: 'CIcon',
  props: {
    size: {
      type: Number,
      default: 16,
    },
    type: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    backdrop: {
      type: Boolean,
      default: false,
    },
    margin: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props, {emit, attrs}) {

    onUpdated(() => {
      // console.log('props.type=================<<<<<<', Icon.value);
    });
    // 填充类
    const Icon = computed(() => {
      let cls = `icon-${props.type}`;
      if (props.color) {
        cls += ` icon-color-${props.color}`;
      }
      return (
        <i
          onClick={onClick}
          {...attrs}
          class={{'iconfont': true , 'icon-component': true,  [cls]: true, margin: props.margin}}
          style={getIconStyle()}
        />
      );
    });

    // 点击事件
    const onClick = (e: any) => {
      emit('click', e);
    };

    // 设置字体大小
    const getIconStyle = () => {
      const chromeMinSize = 12;
      // 支持小于12px
      const retStyle: any = { fontSize: toRem(props.size) };
      if (props.size < chromeMinSize) {
        const ratio = props.size / chromeMinSize;
        retStyle.transform = `scale(${ratio})`;
      }
      return retStyle;
    };

    if (props.backdrop) {
      const backDropSizeRatio = 1.56;
      const backDropSize = toRem(backDropSizeRatio * props.size);
      return () => (
        <span style={{ width: backDropSize, height: backDropSize, lineHeight: backDropSize, textAlign: 'center' }} class='backdrop'>
          {Icon.value}
        </span>
      );
    }

    return () => (<>{Icon.value}</>);
  },
});
