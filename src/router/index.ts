import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory } from 'vue-router';
import Search from '@/views/search/index';
import SearchSongs from '@/views/search/songs';
import SearchPlaylists from '@/views/search/play-lists';
import SearchMvs from '@/views/search/mvs';
const Discovery = () => import('@/views/discovery/index');
const PlaylistDetail = () => import('@/views/playlist-detail/index');
const Playlists = () => import('@/views/playlists/index');
const Songs = () => import('@/views/songs/index');
const Mvs = () => import('@/views/mvs/index');
const Mv = () => import('@/views/mv/index');
const Singer = () => import('@/views/singer/index');
const SingerSongs = () => import('@/views/singer/songs');
const SingerMv = () => import('@/views/singer/mv');
const SingerThumb = () => import('@/views/singer/thumb');
const Thumb = () => import('@/views/thumb/index');

// 内容需要居中的页面
export const layoutCenterNames = ['discovery', 'playlists', 'songs', 'mvs'];

// 需要显示在侧边栏菜单的页面
export const menuRoutes = [
  {
    path: '/discovery',
    name: 'discovery',
    component: Discovery,
    meta: {
      title: '发现音乐',
      icon: 'music',
    },
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: Playlists,
    meta: {
      title: '推荐歌单',
      icon: 'playlist-menu',
    },
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs,
    meta: {
      title: '最新音乐',
      icon: 'yinyue',
    },
  },
  {
    path: '/mvs',
    name: 'mvs',
    component: Mvs,
    meta: {
      title: '最新MV',
      icon: 'mv',
    },
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/discovery',
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: PlaylistDetail,
  },
  {
    path: '/mv/:id',
    name: 'mv',
    component: Mv,
  },
  {
    path: '/thumb/:id',
    name: 'thumb',
    component: Thumb,
  },
  {
    path: '/singer/:id',
    name: 'singer',
    component: Singer,
    children: [
      {
        path: '/',
        redirect: 'songs',
      },
      {
        path: 'songs',
        name: 'singerSongs',
        component: SingerSongs,
      },
      {
        path: 'mv',
        name: 'singerMv',
        component: SingerMv,
      },
      {
        path: 'thumb',
        name: 'singerThumb',
        component: SingerThumb,
      },
    ],
  },
  {
    path: '/search/:keywords',
    name: 'Search',
    component: Search,
    props: true,
    children: [
      {
        path: '/',
        redirect: 'songs',
      },
      {
        path: 'songs',
        name: 'searchSongs',
        component: SearchSongs,
      },
      {
        path: 'playlists',
        name: 'searchPlaylists',
        component: SearchPlaylists,
      },
      {
        path: 'mvs',
        name: 'searchMvs',
        component: SearchMvs,
      },
    ],
  },
  ...menuRoutes,
];

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
