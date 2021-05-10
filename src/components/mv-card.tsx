import {defineComponent} from 'vue';
import {useRouter} from 'vue-router';
import CIcon from '@/components/base/c-icon';
import PlayIcon from '@/components/base/play-icon';
import { isDef , genImgUrl, formatNumber, formatTime} from '@/utils';

// @ts-ignore
import $style from '@/assets/style/components/mv-card.module.scss';
export default defineComponent({
  name: 'MvCard',
  props: ['id', 'img', 'duration', 'playCount', 'name', 'author'],
  components: {
    CIcon,
    PlayIcon,
  },
  setup(props) {
    const router = useRouter();
    const goMv = () => {
      // 如果传入id 则点击直接跳转mv页面
      if (isDef(props.id)) {
        router.push(`/mv/${props.id}`);
      }
    };
    return() => (
      <div onClick={goMv} class={$style['mv-card']}>
        <div class={$style['img-wrap']}>
          <img src={genImgUrl(props.img, 500, 260)} />
          <div class={$style['play-count-wrap']} style={{display: !!props.playCount ? 'block' : 'none'}}>
            <c-icon type={'play'} />
            {formatNumber(props.playCount)}
          </div>
          <div class={$style['play-icon-wrap']}>
            <play-icon size={48} class={$style['play-icon']} />
        </div>
        <div class={$style['duration-wrap']} style={{display: !!props.duration ? 'block' : 'none'}}>
          {formatTime(props.duration / 1000) }
        </div>
        </div>
        <p class={$style.name} style={{display: !!props.name ? 'block' : 'none'}}>{ props.name }</p>
        <p class={$style.author} style={{display: !!props.author ? 'block' : 'none'}}>{props.author}</p>
      </div>
    );
  },
});
