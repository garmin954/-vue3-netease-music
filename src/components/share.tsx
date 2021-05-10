import {defineComponent, ref, onMounted, watch, h} from 'vue';
import CIcon from '@/components/base/c-icon';
import {ElNotification} from 'element-plus';
import HighlightText from '@/components/base/highlight-text';
export default defineComponent({
  name: 'Share',
  components: {
    CIcon,
  },
  props: ['shareUrl'],
  setup(props) {
    const shareIcon = ref();
    const clipboardy = require('clipboardy');
    watch(() => props.shareUrl, (val: any) => {
      clipboardy.write(val);
    });
    onMounted(() => {
      clipboardy.write(props.shareUrl);
    });

    const onSharePromptClick = () => {
      clipboardy.read().then((response: any) => {
        ElNotification({
          message: '分享链接已经复制到剪贴板，快去和小伙伴一起听歌吧！',
          type: 'success',
          duration: 2000,
        });
      }).catch((error: any) => {
        ElNotification({
          message: '复制失败！',
          type: 'error',
          duration: 2000,
        });
      });

    };

    return () => (
      <c-icon
        size={20}
        onClick={onSharePromptClick}
        className='mode-item'
        ref={shareIcon}
        type={'share'}
      />
    );
  },
});
