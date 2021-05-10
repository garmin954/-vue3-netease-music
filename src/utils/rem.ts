/**
 * 根据视窗计算rem
 */
import { throttle } from 'lodash';

export const remBase = 14;

let htmlFontSize: number;

const calc = (): void =>  {
  const maxFontSize = 18;
  const minFontSize = 14;
  const html = document.getElementsByTagName('html')[0];
  const width = html.clientWidth;
  let size = remBase * (width / 1440);
  size = Math.min(maxFontSize, size);
  size = Math.max(minFontSize, size);
  html.style.fontSize = size + 'px';
  htmlFontSize = size;
};

((): void => {
  calc();
  window.addEventListener('resize', throttle(calc, 500));
})();

// 根据基准字号计算
// 用于静态样式
export function toRem(px: number) {
  return `${px / remBase}rem`;
}

// 根据当前的html根字体大小计算
// 用于某些js的动态计算
export function toCurrentRem(px: number) {
  return `${px / htmlFontSize}rem`;
}
