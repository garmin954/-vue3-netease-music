import {defineComponent, onBeforeMount, ref, watch, reactive, onMounted, nextTick} from 'vue';
import {useRoute, RouterView, useRouter} from 'vue-router';
import {ElRow, ElCol, ElImage, ElButton} from 'element-plus';

import Tabs from '@/components/base/tabs';
import '@/assets/style/singer/index.scss';
import {getArtists} from '@/api';
import {genImgUrl} from '@/utils';

export default defineComponent({
  name: 'Singer',
  components: {
    ElRow,
    ElCol,
    ElImage,
    ElButton,
    Tabs,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const artist = ref();
    const state = reactive({
      artist: {},
      id: 0,
      activeTab: 0,
    } as any);

    const tabs = [
      {
        title: '热门作品',
        key: 'songs',
        to: 'songs',
      },
      {
        title: '所有专辑',
        key: 'thumb',
        to: 'thumb',
      },
      {
        title: '相关MV',
        key: 'mv',
        to: 'mv',
      },
    ];
    onMounted(() => {
      nextTick(() => {
        state.id = route.params.id;
      });
    });

    const getArtistsReq = async () => {
      const {artist} = await getArtists(state.id);
      state.artist = artist;
    };
    router.beforeEach((to, from, next) => {
      state.id = to.params.id;
      next();
    });
    watch(() => route, () => {
      state.id = route.params.id;
    });

    watch(() => state.id, () => {
      getArtistsReq();
    });
    return () => (
      <div class={'singer'}>
        {state.artist ? (
          <div class={'header'}>
            <div class='artist-box bg-image-ncc' style={{backgroundImage: `url(${genImgUrl(state.artist.picUrl, 400)})`}}>
              <el-row gutter={20}  type='flex'>
                <el-col span={5}>
                  <el-image fit='cover' className='gm-circle avatar' src={genImgUrl(state.artist.picUrl, 200)}/>
                </el-col>
                <el-col span={17}>
                  <div class='name'>
                    <h3>{state.artist.name}</h3>
                    {
                      ('alias' in state.artist && state.artist.alias.length)
                        ? <span>（{state.artist.alias.join()}）</span>
                        : null
                    }
                  </div>
                  <div class='desc'>
                    {state.artist.briefDesc}
                  </div>
                  <div class='works'>
                    <ul>
                      <li>
                        <h4>单曲</h4>
                        <span>{state.artist.musicSize}</span>
                      </li>
                      <li>
                        <h4>专辑</h4>
                        <span>{state.artist.albumSize}</span>
                      </li>
                      <li>
                        <h4>MV</h4>
                        <span>{state.artist.mvSize}</span>
                      </li>
                    </ul>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        ) : <div></div>}
        <div class={'body'}>
          <div class={'tab-item'}>
            <h3>作品</h3>
            <Tabs
              tabs={tabs}
              class='tabs'
              type='split'
              active={state.activeTab}
              {...{onTabChange: (index: number) => state.activeTab = index}}
            />
          </div>

          <router-view />
        </div>
      </div>
    );
  },
});
