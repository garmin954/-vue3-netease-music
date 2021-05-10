import {defineComponent, Transition, computed, shallowRef, ref, reactive, watch, nextTick, onUpdated} from 'vue';
import {useStore} from 'vuex';
import {useRouter, useRoute} from 'vue-router';
import {ElImage} from 'element-plus';
import Empty from '@/components/base/empty';
import Scroller from '@/components/base/scroller';
import {createSong, debounce, genImgUrl, goMvWithCheck, isDef} from '@/utils';

import { getLyric, getSimiSongs, getSimiPlaylists } from '@/api';


// @ts-ignore
import $style from  '@/assets/style/components/player.module.scss';
import lyricParser from '@/utils/lrcparse';
const WHEEL_TYPE = 'wheel';
const SCROLL_TYPE = 'scroll';
// 恢复自动滚动的定时器时间
const AUTO_SCROLL_RECOVER_TIME = 1000;

const lyricScrolling: any = {
  [WHEEL_TYPE]: false,
  [SCROLL_TYPE]: false,
};
const lyricTimer: any = {
  [WHEEL_TYPE]: null,
  [SCROLL_TYPE]: null,
};

export default defineComponent({
  name: 'Player',
  components: {
      Transition,
    ElImage,
    Empty,
    Scroller,
  },
  setup() {
    const store = useStore();
    const disc = ref();
    const discRotate = ref();
    const scrollerRef = ref();
    const lyricRef = ref<any []>([]);

    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      lyric: [],
      tlyric: [],
      simiLoading: false,
      simiPlaylists: [],
      simiSongs: [],
      nolyric: false,
    });


    // 当前存在歌曲
    const hasCurrentSong = computed(() => store.getters.music.hasCurrentSong);
    // 当前歌曲
    const currentSong = computed(() => store.state.music.currentSong);
    // 当前时间
    const currentTime = computed(() => store.state.music.currentTime);
    // 播放状态
    const playing = computed(() => store.state.music.playing);
    // 是否显示播放面板
    const isPlayerShow = computed(() => store.state.music.isPlayerShow);

    // 打开歌单
    const onClickPlaylist = (id: number) => {
      // 点击的歌单和当前打开的个单页是同一个 直接关闭player
      if (id === Number(route.params.id)) {
        setPlayerShow(false);
      } else {
        router.push({path: `/playlist/${id}`});
      }
    };

    //
    const startSong = (song: any) => store.dispatch('music/startSong', song);
    const addToPlaylist = (song: any) => store.dispatch('music/addToPlaylist', song);

    // 点击歌曲
    const onClickSong = (song: any) => {
      startSong(song);
      addToPlaylist(song);
    };

    const resizeScroller = debounce(() => {
      scrollerRef.value.getScroller().refresh();
    }, 500);

    const addResizeListener = () => {
      window.addEventListener('resize', () => resizeScroller(), false);
    };
    const removeResizeListener = () => {
      window.removeEventListener('resize', resizeScroller, false);
    };

    // 播放页显示类
    const getPlayerShowCls = () => {
      const style = {[$style.player]: true};
      if (isPlayerShow.value) {
        style[$style.show]  = true;
      } else {
        style[$style.hide]  = true;
      }

      return style;
    };

    const setPlayerShow = (state: boolean) => store.commit('music/setPlayerShow', state);

    // 跳转mv播放页
    const onGoMv = () => {
      setPlayerShow(false);
      goMvWithCheck(currentSong.value.mvId);
    };

    // 更新歌曲
    const updateSong = async () => {
      updateLyric();
      updateSimi();
    };

    // 歌词
    const updateLyric = async () => {
      const result: any = await getLyric(currentSong.value.id);
      state.nolyric = !isDef(result.lrc) || !result.lrc.lyric;
      if (!state.nolyric) {
        const lyric_parser: any = lyricParser(result);
        state.lyric = lyric_parser.lyric;
        state.tlyric = lyric_parser.tlyric;
      }

    };

    const updateSimi = async () => {
      state.simiLoading = true;
      const [simiPlaylists, simiSongs] = await Promise.all([
        getSimiPlaylists(currentSong.value.id),
        getSimiSongs(currentSong.value.id),
      ]).finally(() => {
        state.simiLoading = false;
      });
      state.simiPlaylists = (simiPlaylists as any).playlists;
      state.simiSongs = (simiSongs as any).songs.map((song: any) => {
        const {
          id,
          name,
          artists,
          mvid,
          album: { picUrl },
          duration,
          fee
        } = song;
        return createSong({
          id,
          name,
          artists,
          duration,
          img: picUrl,
          mvId: mvid,
          fee
        });
      });
    };

    const scrollToActiveLyric = () => {
      if (activeLyricIndex.value !== -1) {
        if (lyricRef.value && lyricRef.value[activeLyricIndex.value]) {
          scrollerRef.value.getScroller().scrollToElement(lyricRef.value[activeLyricIndex.value], 200, 0, true);
        }
      }
    };

    const clearTimer = (type: string) => {
      lyricTimer[type] && clearTimeout(lyricTimer[type]);
    };

    // 初始化scroller
    const onInitScroller = (scroller: any) => {
      const onScrollStart = (type: string) => {
        clearTimer(type);
        lyricScrolling[type] = true;
      };
      const onScrollEnd = (type: string) => {
        // 滚动结束后两秒 歌词开始自动滚动
        clearTimer(type);
        lyricTimer[type] = setTimeout(() => {
          lyricScrolling[type] = false;
        }, AUTO_SCROLL_RECOVER_TIME);
      };
      scroller.on('scrollStart', onScrollStart.bind(null, SCROLL_TYPE));
      // scroller.on('mousewheelStart', onScrollStart.bind(null, WHEEL_TYPE));
      scroller.on('scrollEnd', onScrollEnd.bind(null, SCROLL_TYPE));
      // scroller.on('mousewheelEnd', onScrollEnd.bind(null, WHEEL_TYPE));
    };


    const lyricWithTranslation = computed(() => {
      let ret: any [] = [];
      // 空内容的去除
      const lyricFiltered = state.lyric.filter(({ content }) => Boolean(content));
      // content统一转换数组形式
      if (lyricFiltered.length) {
        lyricFiltered.forEach((l) => {
          const { time, content } = l;
          const lyricItem = { time, content, contents: [content] };
          const sameTimeTLyric = state.tlyric.find(
            ({ time: tLyricTime }) => tLyricTime === time,
          );
          if (sameTimeTLyric) {
            const { content: tLyricContent } = sameTimeTLyric;
            if (content) {
              lyricItem.contents.push(tLyricContent);
            }
          }
          ret.push(lyricItem);
        });
      } else {
        ret = lyricFiltered.map(({ time, content }) => ({
          time,
          content,
          contents: [content],
        }));
      }

      return ret;
    });

    const getActiveCls = (index: number) => {
      const cls: any = {[$style['lyric-item']]: true};
      if (activeLyricIndex.value === index) {
        cls[$style.active] = true;
      }
      return cls;
    };

    const activeLyricIndex = computed(() => {
      return lyricWithTranslation.value
        ? lyricWithTranslation.value.findIndex((l, index) => {
          const nextLyric = lyricWithTranslation.value[index + 1];
          return (
            currentTime.value >= l.time &&
            (nextLyric ? currentTime.value < nextLyric.time : true)
          );
        })
        : -1;
    });

    watch(() => activeLyricIndex.value, (newIndex, oldIndex) => {
      if (
        newIndex !== oldIndex &&
        !lyricScrolling[WHEEL_TYPE] &&
        !lyricScrolling[SCROLL_TYPE]
      ) {
        scrollToActiveLyric();
      }
    });
    watch(() => route, () => {
      setPlayerShow(false);
    });
    watch(() => currentSong.value, (newSong, oldSong) => {
      if (!newSong.id) {
        setPlayerShow(false);
        return;
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      // 如果歌曲详情显示状态切歌 需要拉取歌曲相关信息
      if (isPlayerShow.value) {
        updateSong();
      } else {
        // 否则只是更新歌词
        updateLyric();
      }
    });
    watch(() => isPlayerShow.value, (show) => {
      if (show) {
        // 歌词短期内不会变化 所以只拉取相似信息
        updateSimi();
        addResizeListener();
        nextTick(() => {
          scrollToActiveLyric();
        });
      } else {
        removeResizeListener();
      }
    });


    const lyricRefFun = (e: HTMLElement, val: number) => {
      if (!lyricRef.value[val]) {
        lyricRef.value[val] = e;
      }
    };

    const play_bar_support = require('@/assets/image/play-bar-support.png');
    const play_bar = require('@/assets/image/play-bar.png');

    return () => (
      <transition name='slide'>
        {(() => {
          if (!!hasCurrentSong) {
            return (
              <div class={getPlayerShowCls()} >
                <div class={$style.content}>
                  <div class={$style.song}>
                    <div class={$style.left}>
                      <el-image
                        class={$style['play-bar-support']}
                        src={play_bar_support}
                      />
                      <img
                        class={{[$style.playing]: playing.value, [$style['play-bar']]: true}}
                        src={play_bar}
                      />
                      <div
                        class={$style['img-outer-border']}
                        ref={disc}
                      >
                        <div
                          class={{[$style.paused]: !playing, [$style['img-outer']]: true}}
                          ref={discRotate}
                        >
                        <div class={$style['img-wrap']}>
                          <el-image
                            lazy
                            src={genImgUrl(currentSong.value.img, 400)}
                          />
                        </div>
                      </div>
                      </div>
                    </div>
                    <div class={$style.right}>
                      <div class={$style['name-wrap']}>
                        <p class={$style.name}>{currentSong.value.name}</p>
                        {(() => {
                          if (!!currentSong.value.mvId) {
                            return (
                              <span
                                onClick={onGoMv}
                                class={$style['mv-tag']}
                              >MV</span>
                            );
                          }
                        })()}

                    </div>
                      <div class={$style.desc}>
                        <div class={$style['desc-item']}>
                          <span class={$style.label}>歌手：</span>
                          <div class={$style.value}>{currentSong.value.artistsText}</div>
                        </div>
                      </div>
                      <empty empty={state.nolyric} info={'还没有歌词哦~'}>
                        {{
                          ctx: ()=>(
                            <scroller
                              data={state.lyric}
                              options={{disableTouch: true}}
                              onInit={onInitScroller}
                              className={$style['lyric-wrap']}
                              ref={scrollerRef}
                              // display={!state.nolyric}
                            >
                              <div>
                                {lyricWithTranslation.value.map((l: any, index) => (
                                  <div
                                    class={getActiveCls(index)}
                                    key={index}
                                    ref={(e: any) => lyricRefFun(e, index)}
                                  >
                                    {l.contents.map((content: any, contentIndex: number) => (
                                      <p
                                        key={contentIndex}
                                        class={$style['lyric-text']}
                                      >
                                        {content}
                                      </p>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </scroller>
                          )
                        }}
                      </empty>

                    </div>
                  </div>
                  <div class={$style['song-list']}>
                    song-list
                  </div>
                  {/*<div class={$style.bottom}>*/}
                  {/*</div>*/}
                </div>
              </div>
            );
          }
        })()}
      </transition>
    );
  },
});
