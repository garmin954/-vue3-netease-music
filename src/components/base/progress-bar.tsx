import {defineComponent, ref, onMounted, watch, shallowRef} from  'vue';
import CIcon from '@/components/base/c-icon';
import { prefixStyle, toCurrentRem } from '@/utils';
// @ts-ignore
import $style from '@/assets/style/components/base/progress_bar.module.scss';
const transform = prefixStyle('transform');

export default defineComponent({
  name: 'ProgressBar',
  props: {
    percent: {
      // type: Number,
      default: 0,
    },
    alwaysShowBtn: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CIcon,
  },
  emits: ['percentChange'],
  setup(props, {emit}) {
    const progressBar = ref();
    const progress = ref();
    const progressBtn = ref();

    const touch = shallowRef<any>({});
    onMounted(() => {
      if (props.percent > 0) {
        setProgressOffset(props.percent);
      }
    });
    const progressClick = (e: any) => {
      if (!props.disabled) {
        const rect = progressBar.value.getBoundingClientRect();
        const offsetWidth = Math.max(
          0,
          Math.min(e.pageX - rect.left, progressBar.value.clientWidth),
        );
        _offset(offsetWidth);
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // _offset(e.offsetX)
        _triggerPercent();
      }
    };

    // 获取进度条位置
    const setProgressOffset = (percent: any) => {
      if (percent >= 0 ) {
        // 总宽度
        const barWidth = progressBar.value.clientWidth;
        // 进度位置
        const offsetWidth = percent * barWidth;
        _offset(offsetWidth);
      }
    };
    const _triggerPercent = () => {
      emit('percentChange', _getPercent());
    };

    // 设置进度条位置
    const _offset = (offsetWidth: number) => {
      const offsetRem = toCurrentRem(offsetWidth);
      progress.value.style.width = `${offsetRem}`;
      progressBtn.value.style[transform] = `translate3d(${offsetRem},0,0)`;
    };

    // 获取百分比
    const _getPercent = () => {
      const barWidth = progressBar.value.clientWidth;
      return progress.value.clientWidth / barWidth;
    };

    watch(() => props.percent, (newPercent) => {
      setProgressOffset(newPercent);
    });

    return () => (
      <div onClick={progressClick} class={$style['progress-bar']} ref={progressBar}>
        <div class={$style['bar-inner']}>
          <div class={$style.progress} ref={progress} />
          <div class={$style['progress-btn-wrapper']} ref={progressBtn}>
            <div class={{[$style.show]: props.alwaysShowBtn, [$style['progress-btn']]: true}}/>
          </div>
        </div>
      </div>
    );
  },
});
