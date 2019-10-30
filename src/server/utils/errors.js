/**
 * Auxiliary functions for error and validation handling.
 */

import CODE from 'http-status-codes';
import joi from '@hapi/joi';

import { logger } from 'topcoder-react-lib';

/**
 * Some aliases for convenience:
 *  - CODE - Standard HTTP error codes (from http-status-codes);
 *  - joi - Object schema validation package.
 */
export { CODE, joi };

/**
 * Creates a new Error with the specified message and HTTP error code.
 * @param {String} msg Error message.
 * @param {Number} statusCode Optional. HTTP error code. Defaults to 500.
 * @return {Error}
 */
export function newError(msg, statusCode = CODE.INTERNAL_SERVER_ERROR) {
  const error = new Error(msg);
  error.statusCode = statusCode;
  return error;
}

/**
 * Throws an error with the specified message and HTTP error code.
 * @param {String} msg Error message.
 * @param {Number} statusCode Optional. HTTP error code. Defaults to 500.
 * @throws {Error} HTTP error.
 */
export function fail(msg, statusCode = CODE.INTERNAL_SERVER_ERROR) {
  const error = newError(msg, statusCode);
  logger.error(error);
  throw error;
}

/**
 * Validates a value using the given Joi schema, and throws an error with the
 * specified message and HTTP error code in case of the validation failure.
 */
export function assert(value, schema, msg = 'Bad Request', statusCode = CODE.BAD_REQUEST) {
  const { error } = schema.validate(value, { abortEarly: false });
  if (error) fail(msg.concat(msg ? '\n' : '', error.message), statusCode);
}
