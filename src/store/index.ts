import { createStore, createLogger } from 'vuex';
import musicModule from './modules/music';
import userModule from './modules/user';
import globalModule from './modules/global';

const debug = process.env.NODE_ENV !== 'production';

export default createStore({
  modules: {
    music: musicModule,
    user: userModule,
    global: globalModule,
  },
  // plugins: debug ? [createLogger()] : [],
});

