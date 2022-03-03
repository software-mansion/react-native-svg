/**
 * MIT License
 * Copyright (c) 2017 Ryan Florence
 * https://github.com/reactjs/react-modal/blob/master/LICENSE
 *
 * Take WAI-ARIA workaround for React Native Web
 *
 * Modified by Ray Andrew <raydreww@gmail.com>
 * For Modal React Native Web
 *
 * MIT License
 * Copyright (c) 2018 Ray Andrew
 * https://github.com/rayandrews/react-native-web-modal
 */

import { canUseDOM } from './utils';

let globalElement = null;

export function assertNodeList(nodeList, selector) {
  if (!nodeList || !nodeList.length) {
    throw new Error(
      `modal-react-native-web: No elements were found for selector ${selector}.`
    );
  }
}

export function setElement(element) {
  let useElement = element;
  if (typeof useElement === 'string' && canUseDOM) {
    const el = document.querySelectorAll(useElement);
    assertNodeList(el, useElement);
    useElement = 'length' in el ? el[0] : el;
  }
  globalElement = useElement || globalElement;
  return globalElement;
}

export function validateElement(appElement) {
  if (!appElement && !globalElement) {
    console.warn(
      false,
      [
        'modal-react-native-web: App element is not defined.',
        'Please use `Modal.setAppElement(el)` or set `appElement={el}`.',
        "This is needed so screen readers don't see main content",
        'when modal is opened. It is not recommended, but you can opt-out',
        'by setting `ariaHideApp={false}`.',
      ].join(' ')
    );

    return false;
  }

  return true;
}

export function hide(appElement) {
  if (validateElement(appElement)) {
    (appElement || globalElement).setAttribute('aria-hidden', 'true');
  }
}

export function show(appElement) {
  if (validateElement(appElement)) {
    (appElement || globalElement).removeAttribute('aria-hidden');
  }
}

export function documentNotReadyOrSSRTesting() {
  globalElement = null;
}

export function resetForTesting() {
  globalElement = null;
}
