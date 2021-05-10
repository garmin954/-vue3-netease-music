import {defineComponent, reactive, onBeforeMount, watch, computed, nextTick, ref} from 'vue';
import {getArtists, getMvDetail, getMvUrl, getSimiMv} from '@/api';
import {useStore} from 'vuex';
import {useRouter, useRoute} from 'vue-router';
import {isDef, formatDate, genImgUrl} from '@/utils';
import MvCard from '@/components/mv-card';
import VideoPlayer from '@/components/base/video-player';
import Card from '@/components/base/card';
import Comments from '@/components/comments';
import '@/assets/style/mv/index.scss';
export default defineComponent({
  name: 'Mv',
  components: {
    MvCard,
    'c-card': Card,
    VideoPlayer,
    Comments,
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const store  = useStore();
    const state = reactive({
      mvDetail: {} as any,
      mvPlayInfo: {} as any,
      artist: {} as any,
      simiMvs: [] as any,
      id: 0,
    });
    const videoRef = ref();


    onBeforeMount(() => {
      state.id = Number(route.params.id);
      init();
    });
    const init = async () => {
      const [
        { data: mvDetail },
        { data: mvPlayInfo },
        { mvs: simiMvs },
      ]: any = await Promise.all([
        getMvDetail(state.id),
        getMvUrl(state.id),
        getSimiMv(state.id),
      ]);
      const { artist } = await getArtists(mvDetail.artistId);

      state.mvDetail = mvDetail;
      state.mvPlayInfo = mvPlayInfo;
      state.artist = artist;
      state.simiMvs = simiMvs;

      nextTick(() => {
        const player = videoRef.value.getPlayerInstance();
        // 监听播放视频
        player.on('play', () => {
          // 停止播放歌曲
          setPlayingState(false);
        });
      });
    };

    watch(() => state.id, () => {
      init();
    });

    const goMv = (e: HTMLElement, id: number) => {
      state.id = id;
      router.push({path: `/mv/${id}`});
    };
    const setPlayingState  = (state: boolean) => store.commit('music/setPlayingState', state);

    const genResource = (brs: any, mvPlayInfo: any) => {
      const { url: mvPlayInfoUrl, r: mvPlayInfoBr } = mvPlayInfo;
      const keyNameMap: any = {
        240: '标清',
        480: '高清',
        720: '超清',
        1080: '1080P',
      };

      return Object.keys(brs).map((key) => {
        // 优先使用mvPlayInfo里的数据
        const findPreferUrl = key === mvPlayInfoBr;
        const name = keyNameMap[key];
        const url = findPreferUrl ? mvPlayInfoUrl : brs[key];
        return {
          url,
          name,
        };
      });
    };

    return () => (
      <div>
      {(() => {
        if (isDef(state.mvDetail.id)) {
          return (
            <div class='mv' >
              <div class='mv-content'>
                <div class='left'>
                  <p class='title'>mv详情</p>

                  <div class='player'>
                    <video-player
                      url={state.mvPlayInfo.url}
                      poster={state.mvDetail.cover}
                      ref={videoRef}
                    />
                  </div>

                  <div class='author-wrap'>
                    <div class='avatar'>
                      <img src={genImgUrl(state.artist.picUrl, 120)} />
                    </div>
                    <p class='author'>{state.artist.name}</p>
                  </div>
                  <p class='name'>{ state.mvDetail.name }</p>
                  <div class='desc'>
                    <span class='date'>
                      发布：{formatDate(state.mvDetail.publishTime, 'yyyy-MM-dd')}
                    </span>
                    <span class='count'>播放：{ state.mvDetail.playCount }次</span>
                  </div>
                  <div class='comments'>
                    <Comments id={state.id} type='mv' />
                  </div>
                </div>
                <div class='right'>
                  <p class='title'>相关推荐</p>
                  <div class='simi-mvs'>
                    {
                      state.simiMvs.map((simiMv: any) => (
                        <c-card
                          desc={`by ${simiMv.artistName}`}
                          key={simiMv.id}
                          name={simiMv.name}
                          onClick={(e: HTMLElement) => goMv(e, simiMv.id)}
                          class='simi-mv-card'
                        >
                          {{
                            'img-wrap': () => (
                              <mv-card
                                duration={simiMv.duration}
                                img={simiMv.cover}
                                playCount={simiMv.playCount}
                              />
                            ),
                          }}
                        </c-card>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          );
        }
      })()}
      </div>
    );
  },
});
