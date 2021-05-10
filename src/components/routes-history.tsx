import {defineComponent} from 'vue';
import {useRouter} from 'vue-router';
import CIcon from '@/components/base/c-icon';

import '@/assets/style/components/routes-history.scss';
export default defineComponent({
  name: 'RoutesHistory',
  components: {
    CIcon,
  },
  setup() {
    const router = useRouter();
    const back = () => {
      router.back();
    };

    const forward = () => {
      router.forward();
    };

    return {
      back,
      forward,
    };
  },

  render(data: any) {
    const {back, forward} = data;
    return (
      <div class='routes-history'>
        <c-icon className={'icon'} backdrop={true} type={'back'} onClick={() => back()} />
        <c-icon className={'icon'} backdrop={true} type={'forward'} onClick={() => forward()} />
      </div>
    );
  },
});
