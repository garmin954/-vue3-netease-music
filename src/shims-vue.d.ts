/* eslint-disable */
import {PluginFunction} from 'vue';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'clipboard' {
  import { PluginFunction } from 'vue';
  const clipboard: PluginFunction<any>;
  // 定义默认导出的类型
  export default clipboard;
}

declare module 'better-scroll' {
  import { PluginFunction } from 'vue';
  const BScroll: PluginFunction<any>;
  // 定义默认导出的类型
  export default BScroll;
}

