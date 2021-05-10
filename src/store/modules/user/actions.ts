import Cookies from 'js-cookie';
import { UID_KEY } from '@/utils';
import { notify, isDef } from '@/utils';
import { getUserDetail, getUserPlaylist } from '@/api';

export default {
  async login({ commit }: any, uid: number) {
    const error = () => {
      notify('登录失败，请输入正确的uid!', 'error');
      return false;
    };

    if (!isDef(uid)) {
      return error();
    }

    try {
      const user = await getUserDetail(uid);
      const { profile }: any = user;
      commit('setUser', profile);
      Cookies.set(UID_KEY, profile.userId);
    } catch (e) {
      return error();
    }

    const { playlist }: any = await getUserPlaylist(uid);
    commit('setUserPlaylist', playlist);
    return true;
  },
  logout({ commit }: any) {
    commit('setUser', {});
    commit('setUserPlaylist', []);
    Cookies.set(UID_KEY, '');
  },
};
