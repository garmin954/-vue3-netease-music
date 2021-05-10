import {defineComponent, ref, computed} from  'vue';
import CIcon from '@/components/base/c-icon';
import ProgressBar from '@/components/base/progress-bar';
// @ts-ignore
import $style from '@/assets/style/components/base/volume.module.scss';

export default defineComponent({
  name: 'Volume',
  components: {
    CIcon,
    ProgressBar,
  },
  props: {
    volume: {
      default: 1,
    },
  },
  emits: ['volumeChange'],
  setup(props, {emit}) {
    const volumePercent = ref(props.volume);

    const onProgressChange = (percent: any) => {
      if (percent < 0.05) {
        percent = 0;
      }
      volumePercent.value = percent;
      emit('volumeChange', percent);
    };
    const getIconType = computed(() => {
      return isSilence.value ? 'silence' : 'horn';
    });

    const toggleSilence = () => {
      isSilence.value = !isSilence;
    };

    let lastVolume = 1;
    const isSilence = computed( {
      get() {
        return volumePercent.value === 0;
      },
      set(newSilence) {
        const target = newSilence ? 0 : lastVolume;
        if (newSilence) {
          lastVolume = volumePercent.value;
        }
        volumePercent.value = target;
        onProgressChange(target);
      },
    });

    return () => (
      <div class={$style.volume}>
        <c-icon size={20} backdrop={true} type={getIconType.value} click={toggleSilence} class='icon'/>
        <div class={$style['progress-wrap']}>
          <progress-bar
            percent={volumePercent.value}
            onPercentChange={onProgressChange}
            alwaysShowBtn
          />
        </div>
      </div>
    );
  },
});
