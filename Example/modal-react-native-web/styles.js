import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  baseStyle: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9999,
  },
  bgTransparent: {
    backgroundColor: 'transparent',
  },
  bgNotTransparent: {
    backgroundColor: '#ffffff',
  },
  hidden: {
    display: 'none',
  },
  visible: {
    display: 'flex',
  },
});
