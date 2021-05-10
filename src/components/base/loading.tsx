import {defineComponent} from 'vue';
export {ElLoading} from 'element-plus';
export default defineComponent({
  name: 'Loading',
  props: ['loading'],
  setup(props) {

    return () => (
      <div
        class='loading'
        element-loading-background='transparent'
        element-loading-spinner='el-icon-loading'
        element-loading-text='载入中'
        style={{height: '200px', display: props.loading ? 'block' : 'none'}}
      />
    );
  },
});
