import {defineComponent, reactive, onMounted, watch, computed} from 'vue';
import {useRoute} from 'vue-router';
import {useStore} from 'vuex';
import {ElImage, ElRow, ElCol, ElAvatar} from 'element-plus';
import CButton from '@/components/base/c-button';
import CIcon from '@/components/base/c-icon';
import Tabs from '@/components/base/tabs';
import SongTable from '@/components/song-table';
import Artists from '@/components/base/artists';
import Comments from '@/components/comments';


import '@/assets/style/thumb/index.scss';
import {getAlbum} from '@/api';
import {createSong, formatDate, genImgUrl} from '@/utils';

export default defineComponent({
  name: 'Thumb',
  components: {
    ElImage,
    ElRow,
    ElCol,
    ElAvatar,
    CButton,
    CIcon,
    Tabs,
    SongTable,
    Artists,
    Comments
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const typeTabs = ['歌曲', '专辑介绍', '评论'];
    const state = reactive({
      activeIndex: 0,
      songs: [],
      id: 0,
      album: {},
    } as any);

    onMounted(() => {
      state.id = route.params.id;
    });

    const getAlbumRes = async () => {
      const {album, songs} = await getAlbum(state.id);
      state.album = album;
      state.songs = songs.map((song: any) => {
        const {id, mv, name, alia, ar, dt, al, fee} = song;
        return createSong({
          id,
          name,
          alias: alia,
          artists: ar,
          duration: dt,
          mvId: mv,
          albumName: al.name,
          albumId: al.id,
          fee,
        });
      });

    };
    const onClickAll = () => {
      startSong(state.songs[0]);
      setPlaylist(state.songs);
    };
    const setPlaylist = (songs: any) => store.commit('music/setPlaylist', songs);
    const startSong = (song: any) => store.dispatch('music/startSong', song);

    watch(() => route, () => {
      // console.log(route);
      state.id = route.params.id;
    }, {deep: true});

    watch(() => state.id, () => {
      getAlbumRes();
    });

    const descTemplate = computed(() => {
      let template = state.album.description.split(/[\n]/).map((item: any) => {
        return `<p>${item}</p>`;
      });
      return template.join('');
    });

    return () => (
      <div class={'thumb-box'}>
        {state.album.name ? (
          <div class={'header'}>
            <div class={'cover'}>
              <img src={genImgUrl(state.album.picUrl, 220)}/>
              <span class='msk'/>
            </div>
            <div class={'header-right'}>
              <div class={'title'}>
                {state.album.name}
              </div>
              <p class='intr'>
                <b>歌手：</b>
                <span title='作者'>
                  <Artists
                    list={state.album.artists}
                  />
                </span>
              </p>
              <p class='intr'>
                <b>发行时间：</b>
                <span title='发行时间'>
                 {formatDate(state.album.publishTime, 'yyyy-MM-dd')}
                </span>
              </p>
              <p class='intr'>
                <b>发行公司：</b>
                <span title='发行公司'>
                 {state.album.company}
                </span>
              </p>

              <c-button class={'play-all'} onClick={onClickAll}>
                <c-icon type={'play'} margin={true}/>
                播放全部
              </c-button>
            </div>
          </div>
        ): null}

        <div class={'body'}>
          <div class={'tabs-box'}>
            <h4>专辑</h4>
            <Tabs
              tabs={typeTabs}
              class='tabs'
              type='split'
              active={state.activeIndex}
              {...{onTabChange: (index: number) => state.activeIndex = index}}
            />
          </div>

          <div class={'alumb-item'}>
            {state.activeIndex === 0 ? (
              <div>
                <song-table
                  songs={state.songs}
                  stripe={true}
                />
              </div>
            ) : null}

            {state.activeIndex === 1 ? (
              <div class={'desc-thumb'} innerHTML={descTemplate.value}>
              </div>
            ) : null}

            {state.activeIndex === 2 ? (
              <Comments id={state.id} type='thumb'/>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
});
