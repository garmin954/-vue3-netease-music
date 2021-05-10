import {defineComponent, reactive} from 'vue';
import {pad, genImgUrl} from '@/utils';
import PlayIcon from '@/components/base/play-icon';

// @ts-ignore
import $style from '@/assets/style/components/song-card.module.scss';
export default defineComponent({
  name: 'SongCard',
  components: {
    PlayIcon,
  },
  props: ['order', 'name', 'img', 'artistsText'],
  setup(props) {
    const state = reactive({
      list: [],
    });

    return () => (
      <div class={$style['song-card']}>
        <div class={$style['order-wrap']}>
          <span class={$style.order}>{pad(props.order)}</span>
        </div>
        <div class={$style['img-wrap']}>
          <img src={genImgUrl(props.img, 120)} />
          <PlayIcon class={$style['play-icon']} />
        </div>
        <div class={$style['song-content']}>
          <p class={$style['song-name']}>{ props.name }</p>
          <p class={$style.singer}>{ props.artistsText }</p>
        </div>
      </div>
  );
  },
});
