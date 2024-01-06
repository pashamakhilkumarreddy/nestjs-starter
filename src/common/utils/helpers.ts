import { BadRequestException } from '@nestjs/common';

/**
 * Checks if a given string is a valid JSON.
 *
 * @param json - The JSON string to be validated.
 *
 * @returns True if the string is a valid JSON object, otherwise false.
 */
export const isValidJson = (json: string) => {
  try {
    const jsonObj = JSON.parse(json);
    return typeof jsonObj === 'object' && jsonObj !== null;
  } catch (err) {
    return false;
  }
};

/**
 * Validates a non-empty JSON string, ensuring it is valid JSON and contains non-empty elements.
 *
 * @param value - The JSON string to be validated.
 *
 * @returns The input JSON string if valid and contains non-empty elements; otherwise, false.
 */
const validateNonEmptyJsonString = (value: string) => {
  if (value.trim() !== '' && isValidJson(value)) {
    const jsonData = JSON.parse(value);
    if (
      Array.isArray(jsonData) &&
      jsonData.some((item) => item.trim() !== '')
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Parses a JSON string and transforms it into an array.
 *
 * Throws an error if the input is not a valid JSON array.
 * @param value - The JSON string to be transformed.
 * @returns The parsed array if successful.
 *
 * @throws Error if the input is not a valid JSON array.
 */
export const transformJsonString = (value: string) => {
  try {
    if (isValidJson(value) && validateNonEmptyJsonString(value)) {
      const parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue)) {
        return parsedValue;
      }
    }
    throw new BadRequestException('invalid JSON string');
  } catch (error) {
    throw new BadRequestException('invalid JSON string');
  }
};
