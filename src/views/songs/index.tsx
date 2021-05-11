import {defineComponent, reactive, onBeforeMount} from 'vue';
import Tabs from '@/components/base/tabs';
import SongTable from '@/components/song-table';
import {getTopSongs} from '@/api';
import {createSong} from '@/utils';

import '@/assets/style/songs/index.scss';
export default defineComponent({
  name: 'Songs',
  components: {
    Tabs,
    SongTable
  },
  setup() {
    onBeforeMount(()=>{
      getSongs()
    })
    const state = reactive({
      activeTabIndex: 0,
      songs: [],
      tabs : [
        { title: '全部', type: 0 },
        { title: '华语', type: 7 },
        { title: '欧美', type: 96 },
        { title: '日本', type: 8 },
        { title: '韩国', type: 16 },
      ],
    });

    const getSongs = async (type=0) => {
      state.activeTabIndex = type;
      const { data } = await getTopSongs(state.activeTabIndex);
      // console.log(data);
      state.songs = data.map((song: any) => {
        const {
          id,
          name,
          artists,
          duration,
          mvid,
          album: { picUrl, name: albumName},
          fee
        } = song;
        return createSong({
          id,
          name,
          artists,
          duration,
          albumName,
          img: picUrl,
          mvId: mvid,
          fee
        });
      });
    };

    return () => (
      <div class='songs'>
        <div class='tabs'>
          <Tabs
            tabs={state.tabs}
            align='right'
            type='small'
            active={state.activeTabIndex}
            {...{onTabChange: getSongs}}
          />
        </div>
        <song-table
          songs={state.songs}
          headerRowClassName='header-row'
        />
      </div>
    );
  },
});
