export function hasClass(el: HTMLElement, className: string) {
  return el.classList.contains(className);
}

export function addClass(el: HTMLElement, className: string) {
  el.classList.add(className);
}

export function getData(el: HTMLElement, name: string, val: string) {
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

export function prefixStyle(style: string) {
  if (vendor === false) {
    return false;
  }

  if (vendor === 'standard') {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

export function hasParent(dom: (Node & ParentNode) | null, parentDom: HTMLDocument | HTMLDocument[]): boolean {
  parentDom = Array.isArray(parentDom) ? parentDom : [parentDom];
  while (dom) {
    if (parentDom.find((p: HTMLDocument) => p === dom)) {
      return true;
    } else {
      dom = dom.parentNode;
    }
  }

  return false;
}

export function scrollInto(dom: HTMLElement) {
  dom.scrollIntoView({ behavior: 'smooth' });
}

export const EMPTY_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
