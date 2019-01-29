export function pickNotNil(object) {
  const result = {};
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const value = object[key];
      if (value !== undefined && value !== null) {
        result[key] = value;
      }
    }
  }
  return result;
}

export const idPattern = /#([^)]+)\)?$/;
