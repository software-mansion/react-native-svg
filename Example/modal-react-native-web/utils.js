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

import PropTypes from 'prop-types';

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const SafeHTMLElement = canUseDOM ? HTMLElement : PropTypes.any;
