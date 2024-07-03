export const extractResizeMode = (resizeMode?: string) => {
  switch (resizeMode) {
    case 'contain':
      return 'xMidYMid meet';
    case 'stretch':
      return 'none';
    default:
      return 'xMidYMid slice';
  }
};
