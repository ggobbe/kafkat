#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { commands } from './cmds/index.mjs';
import kafka from './kafka/kafka.mjs';

if (!process.env.KAFKAT_BROKERS) {
    console.warn(`To configure kafkat, set the following environment variables (cf. README.md):
    - KAFKAT_BROKERS
    - KAFKAT_SSL (optional)
    - KAFKAT_SASL_MECHANISM (optional)
    - KAFKAT_SASL_USERNAME (optional)
    - KAFKAT_SASL_PASSWORD (optional)
    - KAFKAT_SCHEMA_REGISTRY (optional)`);
    process.exit(-1);
}

yargs(hideBin(process.argv))
    .scriptName('kafkat')
    .command(commands)
    .demandCommand(1)
    .parse()
    .then(kafka.disconnect);
