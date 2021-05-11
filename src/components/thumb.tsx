import {defineComponent, onMounted, reactive} from 'vue';
import {useRoute} from 'vue-router';
import {genImgUrl, formatDate} from '@/utils'
import Artists from '@/components/base/artists'
import '@/assets/style/components/thumb.scss';

export default defineComponent({
  name: 'SingerThumb',
  components:{
    Artists
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  setup(props) {
    const route = useRoute();
    onMounted(() => {
      // console.log(props.list);
    });

    return () => (
      <div class='albums-list-box'>
        <div class='albums-list-group'>

          {
            props.list.map((item:any, index:number)=>{

              return (
                <div class='albums-item'>
                  <a href='#/album?id=120664150' class=''>
                    <div class='cover'>
                      <div class='album-bg'>
                        <img src={genImgUrl(item.blurPicUrl, 200)}/>
                      </div>
                    </div>
                    <div class='info'>
                      <h4 class='ellipsis'>{item.name}</h4>
                      <span class='ellipsis'>
                        <Artists
                          list={item.artists}
                        />
                      </span>
                      <time >{formatDate(item.publishTime, 'yyyy-MM-dd')}</time>
                    </div>
                  </a>
                </div>
              )
            })
          }
        </div>
      </div>
      );
    },
  });

