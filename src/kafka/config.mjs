import { logLevel } from 'kafkajs';
import yn from 'yn';

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
    logLevel: logLevel.INFO,
    logCreator: (level) => (entry) => {
        const message = `[${entry.namespace}] ${entry.log.message}`;
        getLogger(level)(message, entry.log);
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
