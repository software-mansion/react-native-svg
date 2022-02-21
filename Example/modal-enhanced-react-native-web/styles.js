/**
 * MIT License
 * Copyright (c) 2017 React Native Community
 * https://github.com/react-native-community/react-native-modal
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
