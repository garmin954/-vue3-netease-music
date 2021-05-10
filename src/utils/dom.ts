export function hasClass(el: HTMLElement, className: any) {
  return el.classList.contains(className);
}

export function addClass(el: HTMLElement, className: any) {
  el.classList.add(className);
}

export function getData(el: HTMLElement, name: any, val: any) {
  const prefix = 'data-';
  if (val) {
    return el.setAttribute(prefix + name, val);
  }
  return el.getAttribute(prefix + name);
}

const elementStyle: any = document.createElement('div').style;

const vendor = ( () => {
  const transformNames: any = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform',
  };

  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false;
})();

export function prefixStyle(style: any) {
  if (vendor === false) {
    return false;
  }

  if (vendor === 'standard') {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

export function hasParent(dom: any, parentDom: any) {
  parentDom = Array.isArray(parentDom) ? parentDom : [parentDom];
  while (dom) {
    if (parentDom.find((p: any) => p === dom)) {
      return true;
    } else {
      dom = dom.parentNode;
    }
  }
}

export function scrollInto(dom: HTMLElement) {
  dom.scrollIntoView({ behavior: 'smooth' });
}

export const EMPTY_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
