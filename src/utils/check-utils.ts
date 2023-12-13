/**
 * Checks whether an object has any null or undefined props
 *
 * @param object Object to be null-checked on every of its prop
 * @returns boolean, indicates if any prop is null within the object
 */
export const hasAllPropsDefined = (object: object): boolean => {
  let response = true;
  Object.values(object).map((prop) => {
    if (prop === null || prop === undefined) {
      response = false;
    }
  });
  return response;
};

/**
 * Check if value is between min and max values
 *
 * @param value value
 * @param min min value
 * @param max max value
 * @returns true if between min and max values
 */
export const between = (value: number, min: number, max: number) => value >= min && value <= max;

/**
 * Validates that given value is not undefined or null
 *
 * @param value value
 * @returns true if value is not undefined or null
 */
export const validateValueIsNotUndefinedNorNull = <T extends Object>(
  value: null | undefined | T
): value is T => {
  return value !== null && value !== undefined;
};
