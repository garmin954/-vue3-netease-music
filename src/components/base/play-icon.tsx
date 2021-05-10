import {defineComponent, computed} from 'vue';
import CIcon from '@/components/base/c-icon';
import '@/assets/style/components/base/play_icon.scss';
export default defineComponent({
  name: 'PlayIcon',
  components: {
    CIcon,
  },
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
  setup(props) {

    const wrapStyle = computed(() => {
      return { width: `${props.size}px`, height: `${props.size}px` };
    });
    const iconSize = computed(() => {
      return props.size * 0.6;
    });

    return () => (
      <div style={wrapStyle.value} class='play-icon-wrap'>
        <CIcon size={iconSize.value} class='play-icon' type='play'/>
      </div>
    );
  },
});
