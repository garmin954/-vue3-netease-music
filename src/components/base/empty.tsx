import {defineComponent, computed, onUpdated, watch} from 'vue';
import '@/assets/style/components/base/empty.scss';

export default defineComponent({
  name: 'Empty',
  props: {
    empty: {
      type: Boolean,
      default: true,
      require: true,
    },
    info: {
      type: String,
      default: String,
      require: '暂无内容',
    },
  },
  setup(props, {slots}) {
    onUpdated(() => {
      console.log('state.nolyric====>', props.empty);
    });
    // const template = computed(() => {
    //   console.log('!props.empty========================>', !props.empty);
    //   if (!!props.empty) {
    //     return (
    //       <div class='empty' style={{display: props.empty ? 'block' : 'none'}}>
    //         {props.info}
    //       </div>
    //     );
    //   } else {
    //     return  (
    //       <>
    //         {slots.default?.()}
    //       </>
    //     );
    //   }
    // });
    //
    // return () => template.value;


    return () => (
      <>
        <div class='empty' style={{display: props.empty ? 'block' : 'none'}}>
          {props.info}
        </div>
        <div style={{display: !props.empty ? 'block' : 'none'}}>
          {slots.ctx?.()}
        </div>
      </>
    )
  },
});
