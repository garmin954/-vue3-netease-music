import {defineComponent, ref, computed, onMounted, onUpdated, toRaw, toRefs, shallowRef} from 'vue';
import {useStore} from 'vuex';
import {RouterLink} from 'vue-router';
import Artists from '@/components/base/artists';

import {ElTable, ElTableColumn} from 'element-plus';
import { pad, goMvWithCheck, genImgUrl, formatTime } from '@/utils';
import HighlightText from '@/components/base/highlight-text';
import CIcon from '@/components/base/c-icon';
import PlayIcon from '@/components/base/play-icon';
import PlayState from '@/components/base/paly-state';

import '@/assets/style/components/song-table.scss';

function genPropsAndAttrs(rawAttrs: any, componentProps: any) {
  const props: any = {};
  const attrs: any = {};
  Object.keys(rawAttrs).forEach((key) => {
    const value = rawAttrs[key];
    if (componentProps.hasOwnProperty(key)) {
      props[key] = value;
    } else {
      attrs[key] = value;
    }
  });
  return { props, attrs };
}


export default defineComponent({
  name: 'SongTable',
  components: {
    HighlightText,
    CIcon,
    PlayIcon,
    ElTable,
    ElTableColumn,
    PlayState,
    RouterLink,
    'c-artists': Artists,
  },
  props: {
    hideColumns: {
      type: Array,
      default: () => [],
    },
    songs: {
      type: Array,
      default: () => [],
    },
    highlightText: {
      type: String,
      default: '',
    },
    // 名字下面渲染的额外内容
    renderNameDesc: {
      type: Function,
    },
    isPlay:{
      type: Boolean,
      default: false,
    }
  },
  setup(props, {attrs}) {
    const store = useStore();
    const columns = shallowRef();

    const commonHighLightSlotScopes = {
      default: (scope: any) => {
        const text = scope.row[scope.column.property] || '1';
        return (
          <HighlightText
            class='song-table-name'
            text={text}
            highlightText={props.highlightText}
          />
        );
      },
    };

    columns.value = [
      {
        prop: 'index',
        label: '',
        width: '70',
        // type: 'index',
        scopedSlots: {
          default: (scope: any) => (
            <div class='index-wrap'>
              {/*{isActiveSong(scope.row) ? (<c-icon class={'horn'} type={'horn'} color={'theme'} />) : (*/}
              {/*  // 补上左边的0*/}
              {/*  <span>{pad(scope.$index + 1)}</span>*/}
              {/*)}*/}
              <play-state id={scope.row.id} index={scope.$index} />
            </div>
          ),
        },
      },
      {
        prop: 'img',
        label: ' ',
        width: '100',
        scopedSlots: {
          default: (scope: any) => {
            return (
              <div class='img-wrap'>
                <img src={genImgUrl(scope.row.img, 120)} />
                <PlayIcon class='play-icon' />
              </div>
            );
          },
        },
      },
      {
        prop: 'name',
        label: '音乐标题',
        className: 'title-td',
        scopedSlots: {
          default: (scope: any) => {
            const {
              row: { mvId , is_vip},
            } = scope;
            const onGoMv = async (e: any) => {
              e.stopPropagation();
              goMvWithCheck(mvId);
            };

            return (
              <div>
                <div class='song-table-name-cell'>
                  {commonHighLightSlotScopes.default(scope)}

                  {mvId ? (
                    <c-icon
                      class='mv-icon'
                      onClick={onGoMv}
                      type='mv-item'
                      color='theme'
                      size={24}
                    />
                  ) : null}

                  {
                    is_vip ? (
                      <c-icon
                        className='mv-icon'
                        onClick={onGoMv}
                        type='vip-item'
                        color='theme'
                        size={24}
                      />
                    ) : null
                  }
                </div>

                {props.renderNameDesc ? props.renderNameDesc(scope) : null}
              </div>
            );
          },
        },
      },
      {
        prop: 'artists',
        label: '歌手',
        scopedSlots: {
          default: (scope: any) => {
            const data = scope.row[scope.column.property] || [{name: '群星', id: 0}];
            return (
              <c-artists
                highlightText={props.highlightText}
                list={data}
              />
            );
          },
        },
      },
      {
        prop: 'albumName',
        label: '专辑',
        scopedSlots: {
          default: (scope: any) => {
            const {
              row: { albumId , is_vip},
            } = scope;

            if (albumId) {
              return (
                <router-link to={`/thumb/${albumId}`}>
                  {commonHighLightSlotScopes.default(scope)}
                </router-link>
              );
            } else {
              return(
                <div>
                  {commonHighLightSlotScopes.default(scope)}
                  <c-icon type={'single'} color='theme' size={24} />
                </div>
              );
            }
          },
        },
      },
      {
        prop: 'durationSecond',
        label: '时长',
        width: '100',
        scopedSlots: {
          default: (scope: any) => {
            return (
              <>
                <span class={'time'}>{formatTime(scope.row.durationSecond)}</span>
                <div class={'tools'}>
                  {/*<span>*/}
                  {/*  <i v-if="playStatus && musicIndex == index" @click="playMe(song.id)" title="暂停" class="iconfont icon-play-off-2"></i>*/}
                  {/*  <i v-else @click="playMe(song.id)" title="播放" class="iconfont icon-play-on-2"></i>*/}
                  {/*</span>*/}
                  {(() => {
                    if (isActiveSong(scope.row) && activeSongState.value === true) {
                      return (
                        <c-icon type={'pause-item'} color='theme' margin={true} onClick={() => stopPlaySong(scope.row)} size={23}/>
                      );
                    } else {
                      return (
                        <c-icon type={'play-item'} color='theme' margin={true}  onClick={() => playSong(scope.row)} size={23}/>
                      );
                    }
                  })()}
                  {props.isPlay ? null : (
                    <c-icon type={'add-item'} color='theme'  margin={true}  onClick={() => addToPlaylist(scope.row)} size={23}/>
                  )}
                </div>
              </>
            );
          },
        },
      },

    ];



    // 点击事件
    const onRowClick = (song: any) => {
      // store.dispatch('music/startSong', song);
      // this.startSong(song)
      // store.dispatch('music/addToPlaylist', song);
    };

    const addToPlaylist = (song: any) => {
      store.dispatch('music/addToPlaylist', song);
    };

    const playSong = (song: any) => {
      if (isActiveSong(song)) {
        store.commit('music/setPlayingState', true);
      } else {
        store.dispatch('music/startSong', song);
        store.dispatch('music/addToPlaylist', song);
      }
    };

    const stopPlaySong = (song: any) => {
      store.commit('music/setPlayingState', false);
    };

    const activeSongState = computed(() => {
      return store.state.music.playing;
    });
    // 是否当前的歌曲
    const isActiveSong = (song: any) => {
      return song.id === store.state.music.currentSong.id;
    };

    // 表格class名称
    const tableCellClassName = (args: any) => {
      const { row, columnIndex } = args;
      const cellClassNameProp: any = attrs.cellClassName;
      const retCls = [];

      // 执行外部传入的方法
      if (cellClassNameProp) {
        const propRet = cellClassNameProp(args);
        if (propRet) {
          retCls.push(propRet);
        }
      }
      if (
        isActiveSong(row) &&
        columnIndex ===
        showColumns.value.findIndex(({ prop }: any) => prop === 'name')
      ) {
        retCls.push('song-active');
      }
      return retCls.join(' ');
    };

    const showColumns = computed(() => {
      const hideColumns = props.hideColumns.slice();
      const reference = props.songs[0];
      const { img }: any = reference;
      if (!img) {
        hideColumns.push('img');
      }
      return columns.value.filter((column: any) => {
        return !hideColumns.find((hideColumn: any) => hideColumn === column.prop);
      });
    });


    const elTableProps = ElTable.props;
    // 从$attrs里提取作为prop的值
    const { _props, _attrs }: any = genPropsAndAttrs(attrs, elTableProps) as any;

    const tableAttrs = computed( () => {
      return {
        ...attrs,
        on: {
          ..._attrs,
        },
        onRowClick,
        ..._props,
        cellClassName: tableCellClassName,
        headerCellClassName: 'title-th',
        data: props.songs,
        style: { width: '99.9%' },
      };
    });

    onUpdated(() => {
      // console.log(props.songs);
    });
    return () => props.songs.length ? (
      <el-table rowClassName={'song-li'} class='song-table' {...tableAttrs.value}>
        {showColumns.value.map((column: any, index: number) => {
          const { scopedSlots, ...columnProps } = column;
          return (
            <el-table-column
              key={index}
              {...columnProps}
              // props={columnProps}
            >
              {scopedSlots}
            </el-table-column>
          );
        })}
      </el-table>
    ) : (<div></div>);
  },
});
