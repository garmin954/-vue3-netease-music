import {defineComponent} from 'vue';
import {useRouter} from 'vue-router';
import {genImgUrl} from '@/utils';

import '@/assets/style/components/top-playlist-card.scss'
export default defineComponent({
  name: 'TopPlaylistCard',
  props: ['id', 'img', 'name', 'desc'],
  setup(props) {
    const router = useRouter();
    const onClickCard = () => {
      router.push({path: `/playlist/${props.id}`});
    };

    return () => (
      <div class='wrap' onClick={onClickCard}>
        <div class='top-playlist-card'>
          <div class='img-wrap'>
            <img src={genImgUrl(props.img, 280)} />
          </div>
          <div class='content'>
            <div class='tag-wrap'>
              <span>精品歌单</span>
            </div>
            <p class='name'>{ props.name }</p>
            <p class='desc'>{ props.desc }</p>
          </div>
        </div>
        <div class='background' style={{ backgroundImage: `url(${props.img})` }}></div>
        <div class='background-mask'></div>
      </div>
    );
  },
});
