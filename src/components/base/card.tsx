import {defineComponent, toRaw} from 'vue';
import {genImgUrl} from '@/utils';
import '@/assets/style/components/base/card.scss';
export default defineComponent({
  name: 'Card',
  props: {
    img: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',

    },
    desc: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, {emit, slots}) {
    const onClick = (e: any) => {
      emit('click', e);
    };

    const imgWarpSlots = () => {
      if ('img-wrap' in slots) {
        return slots['img-wrap']?.();
      } else {
        return (
          <div class='img-wrap'>
            <img src={genImgUrl(props.img, 50)} />
            {slots['img-mask']?.()}
          </div>
        );
      }
    };

    const descSlots = () => {
      if ('desc' in slots) {
        return slots.desc?.();
      } else {
        return props.desc;
      }
    };
    return () => (
      <div onClick={onClick} class={'horizontal-card'}>
        {imgWarpSlots()}

        <div class='card-content'>
          <div class='name'>{ props.name }</div>
          <div class='desc'>
            {descSlots()}
          </div>
        </div>

      </div>
    );
  },
});
