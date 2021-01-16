import { logLevel } from 'kafkajs';
import yn from 'yn';

const LOG_LEVEL = logLevel.INFO;
const LOG_JSON = false;

export const config = {
    brokers: process.env.KAFKACLI_BROKERS?.split(','),
    ssl: yn(process.env.KAFKACLI_SSL) || false,
    sasl: process.env.KAFKACLI_SASL_MECHANISM
        ? {
              mechanism: process.env.KAFKACLI_SASL_MECHANISM,
              username: process.env.KAFKACLI_SASL_USERNAME,
              password: process.env.KAFKACLI_SASL_PASSWORD,
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
