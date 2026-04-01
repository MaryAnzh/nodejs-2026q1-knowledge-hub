export function omitFields<T extends object, K extends keyof T>(
  obj: T,
  fields: K[],
): Omit<T, K> {
  const clone = structuredClone(obj);
  for (const field of fields) {
    delete clone[field];
  }
  return clone;
}
