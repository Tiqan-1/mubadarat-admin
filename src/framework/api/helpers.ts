export function removeEmptyValues<T extends object>(obj: T): { [K in keyof T]: T[K] extends string ? (T[K] extends "" ? null : T[K]) : T[K] extends object ? (T[K] extends null ? null : ReturnType<typeof removeEmptyValues<T[K]>>) : T[K] } {
  const newObj: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string' && value === '') {
        newObj[key] = undefined;
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = removeEmptyValues(value as object);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj;
}