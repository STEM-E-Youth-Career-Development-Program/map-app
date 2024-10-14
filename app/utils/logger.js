import { NODE_ENV} from '@env'

const isDevelopment = NODE_ENV === 'development';
const getTimestamp = () => new Date().toISOString();

const Logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(`[LOG - ${getTimestamp()}]`, ...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info(`[INFO - ${getTimestamp()}]`, ...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(`[WARN - ${getTimestamp()}]`, ...args);
    }
  },
  error: (...args) => {
    console.error(`[ERROR - ${getTimestamp()}]`, ...args);
  },
};
export default Logger;

