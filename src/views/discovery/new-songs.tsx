import {defineComponent, reactive, computed, onBeforeMount} from 'vue';
import {useStore} from 'vuex';
import Title from '@/components/base/title';
import SongCard from '@/components/song-card.tsx';
import {getNewSongs} from '@/api';
import {createSong} from '@/utils';


// @ts-ignore
import $style from '@/assets/style/discovery/new-songs.module.scss';
import {SongInterface} from '@/utils/interface';

const songsLimit = 10;
export default defineComponent({
  name: 'NewSongs',
  components: {
    Title,
    SongCard,
  },
  setup() {
    const state = reactive({
      list: [],
      chunkLimit: Math.ceil(songsLimit / 2)
    });
    const store = useStore();
    onBeforeMount(async () => {
      const { result } = await getNewSongs();
      state.list = result;
    });

    const getSongOrder = (listIndex: number, index: number) => {
      return listIndex * state.chunkLimit + index + 1;
    };

    // 歌曲对象属性
    const nomalizeSong = (song: any): any => {
      const {
        id,
        name,
        song: {
          mvid,
          artists,
          album: { blurPicUrl },
          duration,
          fee
        },
      } = song;
      return createSong({
        id,
        name,
        img: blurPicUrl,
        artists,
        duration,
        mvId: mvid,
        fee
      });
    };

    // 点击歌曲播放
    const onClickSong = (listIndex: number, index: number) => {
      // 这里因为getSongOrder是从1开始显示, 所以当做数组下标需要减一
      const nomalizedSongIndex = getSongOrder(listIndex, index) - 1;
      const nomalizedSong = normalizedSongs.value[nomalizedSongIndex];
      startSong(nomalizedSong);
      addToPlaylist(normalizedSongs.value[index]);
    };

    const setPlaylist = (songs: SongInterface []) => store.commit('music/setPlaylist', songs);
    const startSong = (songs: SongInterface []) => store.dispatch('music/startSong', songs);
    const addToPlaylist = (song: SongInterface []) => store.dispatch('music/addToPlaylist', song);

    // 分成两队
    const thunkedList = computed(() => {
      return [
        state.list.slice(0, state.chunkLimit),
        state.list.slice(state.chunkLimit, state.list.length),
      ];
    });


    const normalizedSongs = computed(() => {
      return state.list.map((song) => nomalizeSong(song));
    });

    return () => (
      <div
        class={$style['new-songs']}
        style={{display: !!state.list ? 'block' : 'none'}}
      >
        <Title>最新音乐</Title>
        <div class={$style['list-wrap']}>

          {
            thunkedList.value.map((list: any, listIndex: number) => (
              <div key={listIndex} class={$style.list}>
                {
                  list.map((item: any, index: number) => (
                    <song-card
                      key={item.id}
                      order={getSongOrder(listIndex, index)}
                      onClick={() => onClickSong(listIndex, index)}
                      class={$style['song-card']}
                      {...nomalizeSong(item)}
                    />
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    );
  },
});
