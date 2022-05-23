import { NumberProp } from './types';

const spaceReg = /\s+/;
const commaReg = /,/g;

declare global {
  interface ArrayConstructor {
    // https://github.com/microsoft/TypeScript/issues/17002
    isArray(arg: unknown): arg is unknown[] | readonly unknown[];
  }
}

export default function extractLengthList(
  lengthList?: readonly NumberProp[] | NumberProp,
): readonly NumberProp[] {
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
