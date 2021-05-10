import {GlobalStateInterface} from '@/store/modules/global/state';

export default {
  setAxiosLoading(state: GlobalStateInterface, loading: boolean) {
    state.axiosLoading = loading;
  },
};
