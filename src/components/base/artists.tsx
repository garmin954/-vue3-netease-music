import {defineComponent, onMounted, createVNode, h} from 'vue';
import {RouterLink} from 'vue-router';
import HighlightText from '@/components/base/highlight-text';
import '@/assets/style/components/base/artists.scss'
export default defineComponent({
  name: 'Artists',
  components: {
    RouterLink,
    HighlightText,
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
    highlightText: {
      type: String,
      default: '',
    },
  },
  setup(props) {

    onMounted(() => {
      // console.log(props.data);
    });
    const splitSymbol = createVNode('span', {
      style: {
        fontWeight: '500',
      },
    }, ()=>'/');
    return () => (
      <div class={'artists-box'}>
        {
          props.list.map((artist: any, index: number) => {
            return (
              <router-link to={`/singer/${artist.id}/songs`}>
                <HighlightText
                  text={artist.name}
                  highlightText={props.highlightText}
                />
                {(index + 1 < props.list.length) ? h('text', {
                  style: {
                    fontWeight: 'bold',
                    margin: '0 4px'
                  },
                }, '/') :  ''}
              </router-link>
            );
          })
        }
      </div>
    );
  },
});
