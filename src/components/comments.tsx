import {defineComponent, reactive, watch, computed, nextTick, ref} from 'vue';
import { getPageOffset, scrollInto, isLast } from '@/utils';
import {ElPagination, ElLoading} from 'element-plus';
import Empty from '@/components/base/empty';
import Comment from '@/components/comment';
// import Loading from '@/components/'
import '@/assets/style/components/comments.scss';
import {
  getSongComment,
  getPlaylistComment,
  getHotComment,
  getMvComment,
  getThumbComment
} from '@/api';

const SONG_TYPE = 'song';
const PLAYLIST_TYPE = 'playlist';
const MV_TYPE = 'mv';
const THUMB_TYPE = 'thumb';
const PAGE_SIZE = 20;
export default defineComponent({
  name: 'Comment',
  components: {
    Comment,
    ElPagination,
    Empty,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    type: {
      // SONG_TYPE, PLAYLIST_TYPE, MV_TYPE 之一
      type: String,
      default: SONG_TYPE,
    },
  },
  emits: ['update'],
  setup(props, {emit}) {
    const commentTitleRef = ref();
    const loadingRef = ref();

    const state = reactive({
      loading: false,
      hotComments: [],
      comments: [],
      total: 0,
      currentPage: 1,
      loadingInstance: {},
    });

    // 获取评论操作
    const getComment = async () => {
      state.loading = true;
      const commentRequestMap: any = {
        [PLAYLIST_TYPE]: getPlaylistComment,
        [SONG_TYPE]: getSongComment,
        [MV_TYPE]: getMvComment,
        [THUMB_TYPE]: getThumbComment,
      };
      // 请求api
      const commentRequest = commentRequestMap[props.type];
      const { hotComments = [], comments = [], total } = await commentRequest({
        id: props.id,
        pageSize: PAGE_SIZE,
        offset: getPageOffset(state.currentPage, PAGE_SIZE),
      }).finally(() => {
        state.loading = false;
      });

      // 歌单的热评需要单独请求接口获取
      if (props.type === PLAYLIST_TYPE && state.currentPage === 1) {
        const { hotComments: exactHotComments = [] } = await getHotComment({
          id: props.id,
          type: 2, // 歌单type
        });
        state.hotComments = exactHotComments;
      } else {
        state.hotComments = hotComments;
      }

      state.comments = comments;
      state.total = total;
      emit('update', { comments, hotComments, total });
    };

    // 页面切换
    const onPageChange = async (page:number) => {
      state.currentPage = page;
      await getComment();
      nextTick(() => {
        scrollInto(commentTitleRef.value);
      });
    };

    watch(() => props.id, (newId) => {
      if (newId) {
        state.currentPage = 1;
        getComment();
      }
    }, {immediate: true});

    watch(() => state.loading, (newVal) => {
      // if (newVal === true) {
      //   state.loadingInstance = ElLoading.service({
      //     target: loadingRef.value,
      //   });
      // } else if ('close' in state.loadingInstance) {
      //   setTimeout(() => {
      //     (state.loadingInstance as any).close();
      //   }, 500);
      // }

    });
    const shouldHotCommentShow = computed(() => {
      return state.hotComments.length > 0 && state.currentPage === 1;
    });

    const shouldCommentShow = computed(() => {
      return state.comments.length > 0;
    });

    return () => (
      <div class='' ref={loadingRef}>
        {(() => {
          if (!state.loading) {
            return (
              <>
                {(() => {
                  if (shouldHotCommentShow.value) {
                    return (
                      <div class='block'>
                        <p class='title'>精彩评论</p>
                        {
                          state.hotComments.map((comment: any, index: number) => (
                            <Comment
                              border={isLast(index, state.hotComments)}
                              comment={comment}
                              key={comment.id}
                            />
                          ))
                        }
                      </div>
                    );
                  }
                })()}

                {(() => {
                  if (shouldCommentShow.value) {
                    return (
                      <div class='block'>
                        <p class='title' ref={commentTitleRef}>
                          最新评论
                          <span class='count'>({state.total})</span>
                        </p>
                        {
                          state.comments.map((comment: any, index: number) => (
                            <Comment
                              border={isLast(index, state.comments)}
                              comment={comment}
                              key={comment.id}
                            />
                          ))
                        }
                      </div>
                    );
                  }
                })()}
                <el-pagination
                  currentPage={state.currentPage}
                  pageSize={PAGE_SIZE}
                  total={state.total}
                  onCurrentChange={onPageChange}
                  class='pagination'
                />
              </>
            );
          }
        }
        )()}

        {(() => {
          if (!state.loading && !shouldHotCommentShow.value && !shouldCommentShow.value) {
            return (<empty>还没有评论哦~</empty>);
          }
        })()}

  </div>

  );
  },
});
