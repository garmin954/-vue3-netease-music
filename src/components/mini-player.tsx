import {defineComponent, computed, watch, reactive, ref, nextTick, h, onUpdated, toRef, customRef} from 'vue';
import {useStore} from 'vuex';
import Cookies from 'js-cookie';
import {ElImage, ElPopover, ElNotification} from 'element-plus';
import HighlightText from '@/components/base/highlight-text';
import CIcon from '@/components/base/c-icon';
import Share from '@/components/share';
import Volume from '@/components/base/volume';
import ProgressBar from '@/components/base/progress-bar';
import {genImgUrl, formatTime, VOLUME_KEY, playModeMap, isDef } from '@/utils';

import '@/assets/style/components/mini-player.scss';
const DEFAULT_VOLUME = 0.75;

export default defineComponent({
    name: 'MiniPlayer',
    components: {
      ElImage,
      CIcon,
      ElPopover,
      HighlightText,
      Share,
      Volume,
      ProgressBar,
    },
    setup() {
      const audioRef = ref();
      const store = useStore();
      const state = reactive({
        togglePlayerShow: true,
        isPlaylistPromptShow: true,
        volume: Cookies.get(VOLUME_KEY) || DEFAULT_VOLUME,
        songReady: false,
        isPlayErrorPromptShow: false,
      });

      const setPlayerShow = (state: boolean) => store.commit('music/setPlayerShow', state);
      const togglePlayerShow = () => {
        setPlayerShow(!isPlayerShow.value);
      };

      // 切换播放暂停
      const togglePlaying = () => {
        if (!currentSong.value.id) {
          return;
        }
        setPlayingState(!playing.value);
      };

      const playMode = computed(() => store.state.music.playMode);
      const setPlayMode = (mode: string) => store.commit('music/setPlayMode', mode);
      // 切换播放模式
      const onChangePlayMode = () => {
        const modeKeys = Object.keys(playModeMap);
        const currentModeIndex = modeKeys.findIndex(
          (key) => (playModeMap as any)[key].code === playMode.value,
        );
        const nextIndex = (currentModeIndex + 1) % modeKeys.length;
        const nextModeKey = modeKeys[nextIndex];
        const nextMode = (playModeMap as any)[nextModeKey];
        setPlayMode(nextMode.code);
      };

      const setPlaylistShow = (state: boolean) => store.commit('music/setPlaylistShow', state);
      const isPlaylistShow = computed(() => store.state.music.isPlaylistShow);
      const togglePlaylistShow = () => {
        // console.log('onclick togglePlaylistShow', !isPlaylistShow.value);
        setPlaylistShow(!isPlaylistShow.value);
      };

      const goGitHub = () => {
        window.open('https://github.com/garmin954/-vue3-netease-music')
      };


      const updateTime = (e: any) => {
        const time = e.target.currentTime;
        setCurrentTime(time);
      };
      const ready = () => {
        // ElNotification({
        //   message: h('text', {}, [
        //     `正在播放 `,
        //     h(HighlightText, {
        //       text: currentSong.value.name,
        //       highlightText: currentSong.value.name,
        //     }, {}),
        //   ]),
        //   type: 'success',
        //   duration: 2000,
        // });
        state.songReady = true;

      };

      const startSong = (nextSong: any) => store.dispatch('music/startSong', nextSong);
      const prevSong = computed(() => store.getters['music/prevSong']);
      // 上一首
      const prev = () => {
        if (state.songReady) {
          startSong(prevSong.value);
        }
      };

      const nextSong = computed(() => store.getters['music/nextSong']);
      // 下一首
      const next = () => {
        if (state.songReady) {
          startSong(nextSong.value);
        }
      };
      const end = () => {
        next();
      };
      const currentTime = computed(() => store.state.music.currentTime);
      const setPlayingState = (state: boolean) => store.commit('music/setPlayingState', state);
      const setCurrentTime = (time: number = 0) => store.commit('music/setCurrentTime', time);

      // onUpdated(() => {
      //   console.log(playing.value);
      // })
      const play = async () => {
        if (state.songReady) {
          try {
            await audioRef.value.play();
            if (state.isPlayErrorPromptShow) {
              state.isPlayErrorPromptShow = false;
            }
          } catch (error) {
            // 提示用户手动播放
            state.isPlayErrorPromptShow = true;
            setPlayingState(false);
          }
        }
      };
      const pause = () => {
        audioRef.value.pause();
      };

      const onVolumeChange = (percent: any) => {
        audioRef.value.volume = percent;
        Cookies.set(VOLUME_KEY, percent);
      };

      const currentSong = computed(() => {
        return store.state.music.currentSong;
      });
      const timer: any = ref(null);
      watch(() => currentSong.value, (newSong, oldSong) => {

        // audioRef.value.play()
        // 清空了歌曲
        if (!newSong.id) {
          audioRef.value.pause();
          audioRef.value.currentTime = 0;
          return;
        }
        // 单曲循环
        if (oldSong && newSong.id === oldSong.id) {
          setCurrentTime(0);
          audioRef.value.currentTime = 0;
          play();
          return;
        }
        state.songReady = false;
        if (timer.value) {
          clearTimeout(timer.value);
        }
        timer.value = setTimeout(() => {
          play();
        }, 1000);


      });

      const playing = computed(() => store.state.music.playing);
      watch(() => playing.value, (newPlaying) => {
        nextTick(() => {
          newPlaying ? play() : pause();
        });
      });
      const currentMode = computed(() => {
        return (playModeMap as any)[playMode.value];
      });
      const modeIcon = computed(() => {
        return currentMode.value.icon;
      });
      const playModeText = computed(() => {
        return currentMode.value.name
      });
      const playIcon = computed((val) => {
        return playing.value ? 'pause' : 'play';
      });

      // 单曲是否存在歌曲
      const hasCurrentSong = computed(() => {
        return isDef(currentSong.value.id);
      });

      // 播放的进度百分比
      const playedPercent = computed(() => {
        const { durationSecond } = currentSong.value;
        return Math.min(currentTime.value / durationSecond, 1) || 0;
      });
      // 进度条改变触发
      const onProgressChange = (percent: number) => {
        audioRef.value.currentTime = currentSong.value.durationSecond * percent;
        setPlayingState(true);
      };
      const isPlayerShow = computed(() => store.state.music.isPlayerShow);
      const playControlIcon = computed(() => {
        return isPlayerShow.value ? 'shrink' : 'open';
      });

      return () => (
        <div class='mini-player' id='mini-player'>
          {/*// 歌曲内容*/}
          <div class='song'>
            {(() => {
              if (state.togglePlayerShow) {
                return (
                  <>
                    <div onClick={togglePlayerShow} class='img-wrap'>
                      <div class='mask'></div>
                      <el-image lazy src={genImgUrl(currentSong.value.img, 80)} class='blur'/>
                      <div class='player-control'>
                        <c-icon size={24} type={playControlIcon.value} color={'white'}/>
                      </div>
                    </div>

                    <div class='content'>
                      <div class='top'>
                        <p class='name'>{currentSong.value.name}</p>
                        <p class='split'>-</p>
                        <p class='artists'>{currentSong.value.artistsText}</p>
                      </div>
                      <div class='time'>
                        <span class='played-time'>{formatTime(currentTime.value)}</span>
                        <span class='split'>/</span>
                        <span class='total-time'>{formatTime(currentSong.value.duration / 1000)}</span>
                      </div>
                    </div>
                  </>
                );
              }
            })()}
          </div>

          {/*// 控制台*/}
          <div class='control'>
            <c-icon size={24} onClick={prev} class='icon' type='prev'/>
            <el-popover
              {...{'onUpdate:visible': (e: any) => state.isPlayErrorPromptShow = e}}
              placement='top'
              trigger='manual'
              width='160'
            >
              {{
                default: () => <p>请点击开始播放。</p>,
                reference: () => (
                  <div onClick={togglePlaying} class='play-icon'>
                    <c-icon size={24} type={playIcon.value}/>
                  </div>
                ),
              }}
            </el-popover>
            <c-icon size={24} onClick={next}  type='next' class='icon'/>
          </div>

          <div class='mode'>
            <share shareUrl={'shareUrl'} class='mode-item' backdrop={true} show={hasCurrentSong.value} />

            {/*// 模式*/}
            <el-popover
              placement='top'
              trigger='hover'
              width='160'>
              {{
                default: () => <p style='text-align: center'>{playModeText.value}</p>,
                reference: () => (
                  <c-icon size={20} type={modeIcon.value} onClick={onChangePlayMode} backdrop={true} className='mode-item'/>
                ),
              }}
            </el-popover>
            {/*// 播放列表*/}
            <el-popover
              {...{'onUpdate:visible': (e: any) => state.isPlaylistPromptShow = e}}
              placement='top'
              trigger='manual'
              width='160'
            >
              {{
                default: () => <p>已更新歌单</p>,
                reference: () => (
                  <c-icon size={20} onClick={togglePlaylistShow} class='mode-item' backdrop={true} type='playlist'/>
                ),
              }}
            </el-popover>

            {/* 音量*/}
            <div class='volume-item'>
              <volume volume={state.volume} onVolumeChange={onVolumeChange} />
            </div>
            {/* github*/}
            <c-icon size={20} onClick={goGitHub} class='mode-item' type='github' title={'Garmin Github'}/>
          </div>

          <div class='progress-bar-wrap'>
              <progress-bar
                disabled={!hasCurrentSong.value}
                percent={playedPercent.value}
                onPercentChange={onProgressChange}
            />
          </div>

          {/*音频播放器*/}
          <audio
            src={currentSong.value.url}
            onCanplay={ready}
            onEnded={end}
            onTimeupdate={updateTime}
            ref={audioRef}
          />
        </div>
      );
    },
  },
);
