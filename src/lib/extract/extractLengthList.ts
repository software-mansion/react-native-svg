import type { NumberProp } from './types';

const spaceReg = /\s+/;
const commaReg = /,/g;

export default function extractLengthList(
  lengthList?: readonly NumberProp[] | NumberProp,
): string[] {
  if (Array.isArray(lengthList)) {
    return lengthList.map((el) => String(el));
  } else if (typeof lengthList === 'number') {
    return [String(lengthList)];
  } else if (typeof lengthList === 'string') {
    return lengthList.trim().replace(commaReg, ' ').split(spaceReg);
  } else {
    return [];
  }
}
