import {defineComponent} from 'vue';
import {useRouter} from 'vue-router';
import {genImgUrl} from '@/utils';
import {ElImage} from 'element-plus';
import PlayIcon from '@/components/base/play-icon';

// @ts-ignore
import $style from '@/assets/style/components/palylist-card.module.scss';
export default defineComponent({
  name: 'PlaylistCard',
  components: {
    ElImage,
    PlayIcon,
  },
  props: ['id', 'img', 'name', 'desc'],
  setup(props) {
    const router = useRouter();
    const onClickCard = () => {
      router.push({path: `/playlist/${props.id}`});
    };

    return () => (
      <div onClick={onClickCard} class={$style['playlist-card']}>
        <div class={$style['img-wrap']}>
          <img  src={genImgUrl(props.img, 300)} />
          {(() => {
            if (props.desc) {
              return (
                <div class={$style['desc-wrap']}>
                  <span class={$style.desc}>{ props.desc }</span>
                </div>
              );
            }
          })()}

          <PlayIcon size={36} class={$style['play-icon']} />
        </div>
        <p class={$style.name}>{ props.name }</p>
      </div>
    );
  },
});
