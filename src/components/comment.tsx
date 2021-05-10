import {defineComponent} from 'vue';
import CIcon from '@/components/base/c-icon';
import {genImgUrl, formatDate} from '@/utils';
import '@/assets/style/components/comment.scss';
export default defineComponent({
  name: 'Comment',
  props: ['comment', 'border'],
  components: {
    CIcon,
  },
  setup(props) {

    return () => (
      <>
        {(() => {
          if (props.comment) {
            return (
              <div class='comment'>
                <div class='avatar'>
                  <img src={genImgUrl(props.comment.user.avatarUrl, 80)} />
                </div>
                <div class={{[props.border]: true, content: true}}>
                  <p class='comment-text'>
                    <span class='username'>{ props.comment.user.nickname }:</span>
                    <span class='text'>{ props.comment.content }</span>
                  </p>
                  {(() => {
                    if (props.comment.beReplied.length) {
                      return (
                        <div class='replied'>
                          <p class='comment-text'>
                            <span class='username'>{ props.comment.beReplied[0].user.nickname }:</span>
                            <span class='text'>{ props.comment.beReplied[0].content }</span>
                          </p>
                        </div>
                      );
                    }
                  })()}
                  <div class='bottom'>
                    <span class='date'>{ formatDate(props.comment.time) }</span>
                    <div class='actions'>
                      <c-icon size={12} type='good' />
                      { props.comment.likedCount }
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </>
    );
  },
});
