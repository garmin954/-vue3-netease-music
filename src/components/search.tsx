import {defineComponent, reactive, ref, computed, onMounted, onUpdated, onBeforeMount, h} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {mapActions, mapMutations, useStore} from 'vuex';
import {ElInput} from 'element-plus';
import Cookies from 'js-cookie';

import Toggle from '@/components/base/toggle';
import CIcon from '@/components/base/c-icon';
import HighlightText from '@/components/base/highlight-text';
import CButton from '@/components/base/c-button';
import '@/assets/style/components/search.scss';
import {createSong, debounce, genArtistisText, uniqueArrObj} from '@/utils';
import {getSearchHot, getSearchSuggest} from '@/api';

const SEARCH_HISTORY_KEY = '__search_history__';

interface StateInterface {
  searchPanelShow: boolean;
  searchKeyword: string;
  searchHots: any;
  searchHistorys: any;
  suggest: any;
  reserveDoms: any;
}
export default defineComponent({
  name: 'Search',
  components: {
    HighlightText,
    CIcon,
    Toggle,
    'c-button': CButton,
    // ElInput,
  },
  setup(props, {attrs}) {
    const router = useRouter();
    const state = reactive({
      searchPanelShow: false,
      searchKeyword: '',
      searchHots: [],
      searchHistorys:  Cookies.getJSON(SEARCH_HISTORY_KEY) || [], // Cookies.get(SEARCH_HISTORY_KEY),
      suggest: {},
      reserveDoms: [],
    } as StateInterface);
    const inputRef = ref();
    const store = useStore();
    const {startSong, addToPlaylist} = {...mapActions(['startSong', 'addToPlaylist'])};
    const {setPlaylist} = {...mapMutations(['setPlaylist'])};

    onUpdated(() => {
    });
    //
    // onMounted(()=>{
    // })
    onBeforeMount(async () => {
      const {result: { hots }} = await getSearchHot() as any;
      state.searchHots = hots;
    });

    const onClickInput = () => {
      state.searchPanelShow = true;
    };
    const onBlur = () => {
      state.searchPanelShow = false;
    };
    const onInput = (value: string) => {
      state.searchKeyword = value;
      if (!value.trim()) {
        return;
      }

      SearchSuggest(value);
    };

    // 处理搜索
    const SearchSuggest = debounce((value: string) => {
        getSearchSuggest(value).then(({result}: any) => {
          state.suggest = result;
        });
      },  800 );

    // 点击热门
    const onClickHot = (hot: any): void => {
      const {first} = hot;
      goSearch(first);
    };

    // 回车键
    const onEnterPress = (e: any) => {
      if (state.searchKeyword) {
        goSearch(state.searchKeyword);
      }
    };

    // 搜索公共接口
    const goSearch = (keywords: string) => {
      state.searchHistorys.push({first: keywords});
      state.searchHistorys = uniqueArrObj(state.searchHistorys, 'first');
      Cookies.set(SEARCH_HISTORY_KEY, JSON.stringify(state.searchHistorys));
      router.push({path: `/search/${keywords}/songs`});
      state.searchPanelShow = false;
    };

    // 点击歌曲
    const onClickSong = (item: any) => {
      const {
        id,
        name,
        artists,
        duration,
        mvid,
        album: {id: albumId, name: albumName},
        fee
      } = item;

      const song = createSong({
        id,
        name,
        artists,
        duration,
        albumId,
        albumName,
        mvId: mvid,
        fee

      });

      store.dispatch('music/startSong', song).then((response) => {
      }).catch((error) => {
      });
      // startSong(song).then((response) => {
      // }).catch((error) => {
      // });
      // addToPlaylist(song).then((response) => {
      // }).catch((error) => {
      // });
    };

    // 点击列表
    const onClickPlaylist = (item: any) => {
      const {id} = item;
      router.push(`/playlist/${id}`);
      state.searchPanelShow = false;
    };

    // 点击mv
    const onClickMv = (mv: any) => {
      const {id} = mv;
      router.push(`/mv/${id}`);
    };

    // 显示搜索建议
    const suggestShow = computed(() => {
      return (
        state.searchKeyword.length &&
        ['songs', 'playlists'].find((key) => {
          return state.suggest[key] && state.suggest[key].length;
        })
      );
    });

    // 格式化搜索建议
    const normalizedSuggests: any = computed({
      get: () => {
        const list = [
          {
            title: '单曲',
            icon: 'music',
            data: state.suggest.songs || [],
            renderName(song: any) {
              return `${song.name} - ${genArtistisText(song.artists)}`;
            },
            onClick: onClickSong.bind(this),
          },
          {
            title: '歌单',
            icon: 'playlist',
            data: state.suggest.playlists || [],
            onClick: onClickPlaylist.bind(this),
          },
          {
            title: 'mv',
            icon: 'mv',
            data: state.suggest.mvs || [],
            renderName(mv: any) {
              return `${mv.name} - ${genArtistisText(mv.artists)}`;
            },
            onClick: onClickMv.bind(this),
          },
        ].filter((item) => item.data && item.data.length);
        return list;
      },
      set: () => {},
    });


    /******************************jsx***********************************/
    const history = () => {
      if (state.searchHistorys.length > 0) {
        return (
          <div class='tags'>
            {
              state.searchHistorys.map((history: any, index: number) => (
                <c-button classDiy={'button'} key={index} onClick={() => onClickHot(history)}>{history.first}</c-button>
              ))
            }
          </div>
        );
      } else {
        return <div class='empty'>暂无搜索历史</div>;
      }
    };
    const content = () => {
      if (suggestShow.value) {
        return (<div class='search-suggest'>
          {
            normalizedSuggests.value.map((normalizedSuggest: any, index: number) => (
              <div key={index} class='suggest-item'>
                <div class='title'>
                  <c-icon size={12} type={normalizedSuggest.icon}/>
                  {normalizedSuggest.name}
                </div>
                <ul class='list'>
                  {
                    normalizedSuggest.data.map((item: any, _index: number) => (
                      <li key={_index} onClick={() => normalizedSuggest.onClick(item)} class='item'>
                        <HighlightText
                          highlightText={state.searchKeyword}
                          text={normalizedSuggest.renderName ? normalizedSuggest.renderName(item) : item.name}
                        />
                      </li>
                    ))
                  }
                </ul>
              </div>
            ))
          }
        </div>);
      } else {
        return (<div class='search-hots'>
          <div class='block'>
            <p class='title'>热门搜索</p>
            <div class='tags'>
              {
                state.searchHots.map((hot: any, index: number) => (
                  <c-button classDiy={'button'} key={index} onClick={() => onClickHot(hot)}>{hot.first}</c-button>
                ))
              }

            </div>
          </div>
          <div class='block'>
            <p class='title'>搜索历史</p>
            {history()}
          </div>
        </div>);
      }
    };
    return () => (
      <div class='search'>
        {h(ElInput, {
          onkeypress: (event: any) => {
            if (event.keyCode === 13) {
              onEnterPress(event);
            }
          },
          onClick: onClickInput,
          onInput,
          placeholder: '搜索',
          prefixIcon: 'el-icon-search',
          ref: inputRef,
          modelValue: state.searchKeyword,
        }, () => '')}
        <toggle
          reserveDoms={[inputRef.value && inputRef.value.$el]}
          show={state.searchPanelShow}
          onUpdateShow={( $event: any ) => {
            state.searchPanelShow = $event;
          }}
        >
          <div class='search-panel' style={{display: state.searchPanelShow ? 'block' : 'none'}}>
            {content()}
          </div>
        </toggle>
      </div>
    );
  },
});
