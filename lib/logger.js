/**
 * Centralized logging utility for consistent error handling
 * across the application (both frontend and backend).
 */

const isDev = typeof process !== 'undefined'
  ? process.env.NODE_ENV !== 'production'
  : typeof import.meta !== 'undefined' && import.meta.env?.DEV;

/**
 * Log levels for categorizing messages
 */
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

/**
 * Format error for logging
 * @param {Error|string} error
 * @returns {object}
 */
function formatError(error) {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: isDev ? error.stack : undefined,
    };
  }
  return { message: String(error) };
}

/**
 * Log a message with context
 * @param {string} level - Log level
 * @param {string} context - Context/location (e.g., 'api/chat', 'TokenPage')
 * @param {string} message - Human-readable message
 * @param {object} data - Additional data to log
 */
function log(level, context, message, data = {}) {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level,
    context,
    message,
    ...data,
  };

  // In production, only log warnings and errors
  if (!isDev && level === LogLevel.DEBUG) {
    return;
  }

  // Format for console
  const prefix = `[${context}]`;

  switch (level) {
    case LogLevel.ERROR:
      console.error(prefix, message, data.error ? formatError(data.error) : data);
      break;
    case LogLevel.WARN:
      console.warn(prefix, message, data);
      break;
    case LogLevel.INFO:
      if (isDev) console.info(prefix, message, data);
      break;
    case LogLevel.DEBUG:
      if (isDev) console.debug(prefix, message, data);
      break;
    default:
      if (isDev) console.log(prefix, message, data);
  }

  // TODO: In production, send to monitoring service
  // if (!isDev && (level === LogLevel.ERROR || level === LogLevel.WARN)) {
  //   sendToMonitoring(logData);
  // }
}

/**
 * Log an error with context
 * @param {string} context - Where the error occurred
 * @param {Error|string} error - The error
 * @param {object} extra - Additional context
 */
export function logError(context, error, extra = {}) {
  log(LogLevel.ERROR, context, error.message || String(error), {
    error,
    ...extra,
  });
}

/**
 * Log a warning with context
 * @param {string} context - Where the warning occurred
 * @param {string} message - Warning message
 * @param {object} data - Additional data
 */
export function logWarn(context, message, data = {}) {
  log(LogLevel.WARN, context, message, data);
}

/**
 * Log info (only in development)
 * @param {string} context - Context
 * @param {string} message - Message
 * @param {object} data - Additional data
 */
export function logInfo(context, message, data = {}) {
  log(LogLevel.INFO, context, message, data);
}

/**
 * Log debug info (only in development)
 * @param {string} context - Context
 * @param {string} message - Message
 * @param {object} data - Additional data
 */
export function logDebug(context, message, data = {}) {
  log(LogLevel.DEBUG, context, message, data);
}

export default {
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
};
