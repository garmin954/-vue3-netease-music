import {defineComponent, reactive, onBeforeMount} from 'vue';
import PlaylistCard from '@/components/playlist-card';
import Title from '@/components/base/title';
import {getPersonalized} from '@/api';
// @ts-ignore
import $style from '@/assets/style/discovery/new-playlists.module.scss';
export default defineComponent({
  name: 'NewPlaylists',
  components: {
    PlaylistCard,
    Title,
  },
  setup() {
    const state = reactive({
      list: [],
    });

    onBeforeMount(async () => {
      const { result } = await getPersonalized({ limit: 10 });
      state.list = result;
    });

    return () => (
      <div
        class='recommend'
        style={{display: !!state.list.length ? 'block' : 'none'}}
      >
        <Title>推荐歌单</Title>
        <div class={$style['list-wrap']}>
          {
            state.list.map((item: any) => (
              <playlist-card
                desc={item.copywriter}
                id={item.id}
                img={item.picUrl}
                key={item.id}
                name={item.name}
              />
            ))
          }

        </div>
      </div>
    );
  },
});
