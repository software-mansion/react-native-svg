export function removeKeys<T extends object>(
  obj: T,
  keys: string[]
): Partial<T> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key as keyof T];
  });
  return result;
}
