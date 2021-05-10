import {defineComponent, watch, reactive, VNode, onMounted} from 'vue';
import {ElButton, ElRow} from 'element-plus';
import {getPageOffset, scrollInto} from '@/utils';

export default defineComponent({
  name: 'SimplePagination',
  components: {
    ElButton,
    ElRow,
  },
  props: {
    getData: {
      type: Function,
      required: true,
    },
    getDataParams: {
      type: Object,
      default: () => ({}),
    },
    limit: {
      type: Number,
      default: 10,
    },
    more:{
      type: String,
      default: 'more',
    }

  },
  emits: ['getDataSuccess', 'getDataError'],
  setup(props, {slots, emit}) {
    const state = reactive({
      offset: 0,
      more: true,
    });

    onMounted(() => {
      onPageChange();
    });

    const prev = () => {
      if (state.offset <= props.limit) {
        return;
      }
      state.offset -= props.limit;
      onPageChange();
    };

    const next = () => {
      if (!state.more) {
        return;
      }
      state.offset += props.limit;
      onPageChange();
    };

    const onPageChange = async () => {

      try {
        const result = await props.getData({
          limit: props.limit,
          offset: state.offset,
          ...props.getDataParams,
        });

        const {[props.more]:more } = result;
        state.more = more;
        emit('getDataSuccess', result);
      } catch (error) {
        emit('getDataError', error);
      }
    };

    watch(() => props.getDataParams, () => {
      state.offset = 1;
      onPageChange();
    }, {deep: true});


    const slotsTemplate = () => {
      let listSlots: any = <div>1</div>;
      if (slots.lists) {
        listSlots = slots.lists?.();
      }

      return listSlots;
    };
    return () => (
      <div class={'simple-pagination'}>
        {slotsTemplate()}
        <el-row>
          <el-button round disabled={state.offset <= props.limit} onClick={prev}>上一页</el-button>
          <el-button round disabled={!state.more} onClick={next}>下一页</el-button>
        </el-row>
      </div>
    );
  },
});
