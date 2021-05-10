import {defineComponent} from 'vue';

// @ts-ignore
import $style from '@/assets/style/components/base/title.module.scss';
export default defineComponent({
  name: 'Title',
  setup(props, {slots}) {

    return() => (
      <div class={$style['title-wrap']}>
        <p class={$style.title}>
          {slots.default?.()}
        </p>
      </div>
    );
  },
});
