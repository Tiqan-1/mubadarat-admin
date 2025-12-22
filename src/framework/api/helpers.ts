// remove empty values (null, empty string) from an object (request payload, response result,..)
export function removeEmptyValues(obj: any): any {
  // Handle Arrays: Map and Filter
  if (Array.isArray(obj)) {
    return obj
      .map((item) => removeEmptyValues(item)) // Recurse first
      .filter((item) => item !== undefined);  // Remove undefined items
  }

  // Handle Objects
  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (typeof value === 'string' && value === '') {
          // Skip adding this key (effectively removing it)
          continue;
        } else if (typeof value === 'object' && value !== null) {
          const cleaned = removeEmptyValues(value);
          // Optional: Check if the cleaned object is empty and remove it too?
          newObj[key] = cleaned;
        } else {
          newObj[key] = value;
        }
      }
    }
    return newObj;
  }

  // Handle Primitives (Pass through)
  return obj;
}