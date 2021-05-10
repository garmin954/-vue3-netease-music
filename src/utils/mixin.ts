import store from '@/store';
import {onMounted, onUnmounted} from 'vue';

export const hideMenuMixin = {
  onMounted() {
    store.commit('music/setMenuShow', false);
  },
  onUnmounted() {
    store.commit('music/setMenuShow', true);
  },
};

export const hideMiniPlayerMixin = {
  onMounted() {
    store.commit('music/setMiniPlayerShow', false);
  },
  onUnmounted() {
    store.commit('music/setMiniPlayerShow', true);
  },
};
