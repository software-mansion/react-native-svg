const spaceReg = /\s+/;
const commaReg = /,/g;

export default function extractLengthList(lengthList) {
  if (Array.isArray(lengthList)) {
    return lengthList;
  } else if (typeof lengthList === 'number') {
    return [lengthList];
  } else if (typeof lengthList === 'string') {
    return lengthList
      .trim()
      .replace(commaReg, ' ')
      .split(spaceReg);
  } else {
    return [];
  }
}
