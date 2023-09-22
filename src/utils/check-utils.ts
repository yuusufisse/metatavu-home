/**
 * Checks whether an object has any null or undefined props
 *
 * @param object Object to be null-checked on every of its prop
 * @returns boolean, indicates if any prop is null within the object
 */
export const hasAllPropsDefined = (object: object): boolean => {
  Object.keys(object).map((prop) => {
    if (prop !== null || prop !== undefined) {
      return false;
    }
  });
  return true;
};
