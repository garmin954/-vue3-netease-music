import {defineComponent, watch, onUnmounted, onMounted, onUpdated, nextTick, ref} from 'vue';
// import '@/assets/style/layout/header.scss';
import { hasParent } from '@/utils';

export default defineComponent({
  name: 'Toggle',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    reserveDoms: {
      type: Array,
      default: [],
    },
  },
  emits: ['updateShow'],
  setup(props, {slots, emit}) {
    const boxRef = ref();
    // 点击事件
    const clickEvent = (e: any) => {
      const triggerElement = e.target;
      // 触发点击事件的dom是否是playlist的子节点
      const firstChildElm = boxRef.value.firstElementChild;
      const defaultReserveDoms = Array.from(
        document.querySelectorAll('.el-loading-mask, .el-loading-spinner'),
      );
      const reserves: any [] = defaultReserveDoms.concat(firstChildElm);
      if (!hasParent(triggerElement, reserves.concat(props.reserveDoms))) {
        emit('updateShow', false);
      }
    };

    // 绑定点击
    const bindClick = () => {
      document.addEventListener('mousedown', clickEvent);
    };

    // 删除点击
    const removeClick = () => {
      document.removeEventListener('mousedown', clickEvent);
    };


    watch(() => props.show, (newShow) => {
      nextTick(() => {
        if (newShow) {
          bindClick();
        } else {
          removeClick();
        }
      });
    });

    onUnmounted(() => {
      removeClick();
    });

    return () => (
          <div ref={boxRef}>
            {slots.default?.()}
          </div>
        );
    },
});
