import {defineComponent, ref, watch, nextTick, onMounted} from 'vue';
// @ts-ignore
// import BScroll = require('better-scroll');
import BScroll from 'better-scroll';

// @ts-ignore
import $style from '@/assets/style/components/base/scroller.module.scss';

const defaultOptions = {
  scrollY: true,
  probeType: 3,
};

export default defineComponent({
  name: 'Scroller',
  props: {
    data: {
      default: () => [],
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    // display: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  emits: ['init'],
  setup(props, {slots, attrs, emit, expose}) {
    const scrollerRef = ref();
    const bscroll = ref();
    const getScroller = () => {
      return bscroll.value;
    };

    const refresh = () => {
      bscroll.value.refresh();
    };


    watch(() => props.data, () => {
      nextTick(() => {
        if (!bscroll.value) {
          bscroll.value = new BScroll(
            scrollerRef.value as HTMLElement,
            Object.assign({}, defaultOptions, props.options),
          );

          emit('init', bscroll.value);
        } else {
          bscroll.value && bscroll.value.refresh();
        }
      });
    }, {
      immediate: true,
    });

    expose({
      refresh,
      getScroller,
    });

    return () => (
      <div class={$style.scroller} ref={scrollerRef}>
        <>
          {(() => {
            // if (!!props.display) {
              return slots.default?.();
            // }
          })()}
        </>
      </div>
    );
  },
});
