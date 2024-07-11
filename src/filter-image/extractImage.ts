export const extractResizeMode = (resizeMode?: string) => {
  switch (resizeMode) {
    case 'contain':
      return 'xMidYMid meet';
    case 'stretch':
      return 'none';
    case 'center':
      return 'xMidYMid meet';
    default:
      return 'xMidYMid slice';
  }
};
