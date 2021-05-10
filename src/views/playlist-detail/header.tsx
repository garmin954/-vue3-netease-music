import {defineComponent, reactive, computed, onUpdated} from 'vue';
import {useStore} from 'vuex';
import {genImgUrl, formatDate} from '@/utils';
import CButton from '@/components/base/c-button';
import CIcon from '@/components/base/c-icon';
import '@/assets/style/playlist-detail/header.scss';

export default defineComponent({
  name: 'PlayListDetailHeader',
  components: {
    CButton,
    CIcon,
  },
  props: {
    playlist: {
      type: Object,
      default: () => ({}),
    },
    songs: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const store = useStore();
    const playAll = () => {
      startSong(props.songs[0]);
      setPlaylist(props.songs);
    };

    onUpdated(()=>{
      console.log(props.playlist);
    })
    const setPlaylist = (songs: any) => store.commit('music/setPlaylist', songs);
    const startSong = (song: any) => store.dispatch('music/startSong', song);

    const tagsText = computed(() => {
      return props.playlist.tags.join('/');
    });



    return () => (
      <>
      {(() => {
        if (props.playlist.id) {
          return  (
            <div class='header' >
              <div class='img-wrap'>
                <img src={genImgUrl(props.playlist.coverImgUrl, 400)} />
              </div>
              <div class='content'>
                <div class='title-wrap'>
                  <p class='title'>{ props.playlist.name }</p>
                </div>
                <div class='creator-wrap'>
                  <img src={ props.playlist.creator.avatarUrl} class='avatar' />
                  <p class='creator'>{ props.playlist.creator.nickname }</p>
                  <p class='create-time'>
                    { formatDate(props.playlist.createTime, 'yyyy-MM-dd') } 创建
                  </p>
                </div>
                <div class='action-wrap'>
                  <c-button onClick={playAll} class='button'>
                    <c-icon class='icon middle' color='white' type='play-round' />
                    <span class='middle'>播放全部</span>
                  </c-button>
                </div>
                <div class='desc-wrap'>
                  {(() => {
                    if (tagsText.value) {
                      return (
                        <p class='desc' >
                          <span>标签：{ tagsText.value }</span>
                        </p>
                      );
                    }
                  })()}

                  {(() => {
                    if (props.playlist.description) {
                      return (
                        <p class='desc'>
                          <span class='value'>简介：{ props.playlist.description }</span>
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          );
        } else {

          return (<div></div>);
        }
      })()}
      </>
    );
  },
});
