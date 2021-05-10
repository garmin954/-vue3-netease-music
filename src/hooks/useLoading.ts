import {nextTick, Ref, onBeforeMount, shallowRef} from 'vue';
import {ElLoading} from 'element-plus';
export default function(targetRef?: Ref) {
  const loadingInstance = shallowRef<any>(null);
  const start = () => {
    loadingInstance.value = ElLoading.service({ fullscreen: true });
  };

  const close = () => {
    loadingInstance.value.close();
  }
  return {start, close};
}


