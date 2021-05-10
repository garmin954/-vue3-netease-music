import {defineComponent, onMounted, watch, ref, h} from 'vue';
import {ElPagination} from 'element-plus';
import {getPageOffset, scrollInto} from '@/utils';
export default defineComponent({
  name: 'WithPagination',
  components: {
    ElPagination,
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
    scrollTarget: {
      type: HTMLElement,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  emit: ['getDataSuccess', 'getDataError'],
  setup(props, {emit, slots}) {
    const currentPage = ref<number>(0);
    onMounted(() => {
      onPageChange().then((response) => {

      }).catch((error) => {

      });
    });

    const onPageChange = async () => {
      try {
        const result = await props.getData({
          limit: props.limit,
          offset: getPageOffset(currentPage.value, props.limit),
          ...props.getDataParams,
        });
        emit('getDataSuccess', result);
        // 如果传入了滚动的目标对象 分页后自动滚入
        if (props.scrollTarget) {
          scrollInto(props.scrollTarget);
        }
      } catch (error) {
        emit('getDataError', error);
      }
    };

    watch(() => props.getDataParams, () => {
      currentPage.value = 1;
      onPageChange();
    }, {deep: true});
    return () => (
      <div class='with-pagination'>
        {slots.default?.()}
        <div class='pagination-wrap'>
          {h(ElPagination, {
            'currentPage': currentPage.value,
            'onUpdate:currentPage': (e: any) => {
              currentPage.value = e;
            },
            'pageSize': props.limit,
            'total': props.total,
            'onCurrentChange': onPageChange,
            'class': 'pagination                                                   ',
          }, () => '')}
        </div>
      </div>
    );
  },
});
