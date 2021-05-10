import {defineComponent, reactive, onBeforeMount} from 'vue';
import Title from '@/components/base/title';
import MvCard from '@/components/mv-card';
import {getPersonalizedMv} from '@/api';

// @ts-ignore
import $style from '@/assets/style/discovery/new-mv.module.scss';
export default defineComponent({
  name: 'NewMv',
  components: {
    Title,
    MvCard,
  },
  setup() {
    const state = reactive({
      mvs: [],
    });

    onBeforeMount(() => {
      getMvs();
    });
    const getMvs = async () => {
      const { result } = await getPersonalizedMv();
      state.mvs = result;
    };


    return() => (
      <div
        class={$style['new-mvs']}
        style={{display: !!state.mvs.length ? 'block' : 'none'}}
      >
        <Title>推荐MV</Title>
        <ul class={$style['list-wrap']}>
          {
            state.mvs.map((mv: any) => (
              <li
                key={mv.id}
                class={$style['list-item']}
              >
              <mv-card
                author={mv.artistName}
                id={mv.id}
                img={mv.picUrl}
                name={mv.name}
                playCount={mv.playCount}
              />
            </li>
            ))
          }
        </ul>
      </div>
    );
  },
});
