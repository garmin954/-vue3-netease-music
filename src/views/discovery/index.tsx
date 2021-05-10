import {defineComponent} from 'vue';
import Banner from '@/views/discovery/banner';
import NewPlaylists from '@/views/discovery/new-playlists';
import NewSongs from '@/views/discovery/new-songs';
import NewMv from '@/views/discovery/new-mvs';


export default defineComponent({
  name: 'Discovery',
  components: {
    Banner,
    NewPlaylists,
    NewSongs,
    NewMv
  },
  setup() {

    return () => (
      <div style={{padding: '18px 32px'}}>
        <div class='discovery-content'>
          <Banner />
          <NewPlaylists />
          <NewSongs />
          <NewMv />
        </div>
      </div>
    )
  },
});
