import { logLevel } from 'kafkajs';
import yn from 'yn';

const LOG_LEVEL = logLevel.INFO;
const LOG_JSON = false;

export const config = {
    brokers: process.env.KAFKAT_BROKERS?.split(','),
    ssl: yn(process.env.KAFKAT_SSL) || false,
    sasl: process.env.KAFKAT_SASL_MECHANISM
        ? {
              mechanism: process.env.KAFKAT_SASL_MECHANISM,
              username: process.env.KAFKAT_SASL_USERNAME,
              password: process.env.KAFKAT_SASL_PASSWORD,
          }
        : undefined,
    logLevel: LOG_LEVEL,
    logCreator: (level) => (entry) => {
        if (LOG_JSON) {
            getLogger(level)(entry.log);
        } else {
            const message = `[${entry.namespace}] ${entry.log.message}`;
            getLogger(level)(message);
        }
    },
};

function getLogger(logLevel) {
    switch (logLevel) {
        case logLevel.DEBUG:
            return console.debug;
        case logLevel.INFO:
            return console.info;
        case logLevel.WARN:
            return console.warn;
        case logLevel.ERROR:
            return console.error;
        default:
            return console.error;
    }
}
