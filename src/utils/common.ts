import { ElNotification } from 'element-plus';
import {prop} from 'vue-class-component';

export { debounce, throttle } from 'lodash';
// 补全0
export function pad(num: number, n = 2): string {
  let len = num.toString().length;
  let res: string = num.toString();
  while (len < n) {
    res = '0' + num;
    len++;
  }
  return res;
}

// 时间格式
interface FormatDateInterface {
  [prop: string]: number;
}
export function formatDate(date: Date, fmt = 'yyyy-MM-dd hh:mm:ss'): string {
  date = date instanceof Date ? date : new Date(date);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  }
  const o: FormatDateInterface = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      if (Object.keys(o).includes(k)) {
        const str = o[k] + '';
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : padLeftZero(str),
        );
      }

    }
  }
  return fmt;
}

function padLeftZero(str: string): string {
  return ('00' + str).substr(str.length);
}

// 时分秒格式
export function formatTime(interval: number): string {
  const minute = pad((interval / 60) | 0);
  const second = pad(Number(Number(interval % 60).toFixed(0)));
  return `${minute}:${second}`;
}

// 换算整数
export function formatNumber(number: number): string {
  number = Number(number) || 0;
  return number > 100000 ? `${Math.round(number / 10000)}万` : number.toString();
}

// 图片尺寸
export function genImgUrl(url: string, w?: number, h?: number) {
  if (!h) {
    h = w;
  }
  url += `?param=${w}y${h}`;
  return url;
}

// 是否未最后一个
export function isLast(index: number, arr: any []): boolean {
  return index === arr.length - 1;
}

// 数组的第一级是否相等
export function shallowEqual(a: any, b: any, compareKey: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    let compareA = a[i];
    let compareB = b[i];
    if (compareKey) {
      compareA = compareA[compareKey];
      compareB = compareB[compareKey];
    }
    if (!Object.is(a[i], b[i])) {
      return false;
    }
  }
  return true;
}


// 消息提示
// success/warning/info/error
export function notify(message: string, type ?: 'success' | 'warning' | 'info' | 'error', duration?: number): any {
  const params = {
    message,
    duration,
    type,
  };

  return ElNotification(params);
}

// ['success', 'warning', 'info', 'error'].forEach((key) => {
//   notify[key] = (message) => {
//     return notify(message, key);
//   };
// });

// 打开全屏
export function requestFullScreen(element: Element | any): void {
  const docElm = element;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
    } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  }
}

// 关闭全屏
export function exitFullscreen(): void {
  const de: Document|any = window.parent.document;

  if (de.exitFullscreen) {
    de.exitFullscreen();
  } else if (de.mozCancelFullScreen) {
    de.mozCancelFullScreen();
  } else if (de.webkitCancelFullScreen) {
    de.webkitCancelFullScreen();
  } else if (de.msExitFullscreen) {
    de.msExitFullscreen();
  }
}


// 是否为全屏
export function isFullscreen(): boolean {
  const _document: any = document;
  return _document?.fullscreen ||
    _document?.mozFullscreen ||
    _document.webkitIsFullScreen;
}

// 判断是否为undefined
export function isUndef(v: any): boolean {
  return v === undefined || v === null;
}
// 不为undefined 和 null
export function isDef(v: any): boolean {
  return v !== undefined && v !== null;
}

// 是否为ture
export function isTrue(v: any): boolean {
  return v === true;
}
// 是否为false
export function isFalse(v: any): boolean {
  return v === false;
}

export function getPageOffset(page: number, limit: number): number {
  if (page === 0) {
    return 0;
  }
  return (page - 1) * limit;
}

export function uniqueArrObj(arr: any [], objKay: string) {
  const temp = new Map();
  return arr.filter((item: any) => !temp.has(item[objKay]) && temp.set(item[objKay], 1));
}
