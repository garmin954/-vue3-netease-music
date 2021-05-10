import Vue, {defineComponent, computed} from 'vue';
import '@/assets/style/components/c-button.scss';

export default defineComponent({
  name: 'CButton',
  props: {
    type: {
      type: String,
      default: 'common',
    },

    classDiy: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, {slots, emit, attrs}) {

    const getCls = computed(() => {
      let cls = 'n-button ';
      if (!!props.classDiy) {
        cls += props.classDiy;
      }
      return cls;
    });
    const onClick = (e: any): void => {
      emit('click', e);
    };
    return () => (
      <div onClick={onClick} class={getCls.value}>
        {slots.default?.()}
      </div>
    );
  },
});
