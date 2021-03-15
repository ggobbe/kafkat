#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { commands } from './cmds/index.mjs';
import kafka from './kafka/kafka.mjs';

if(!process.env.KAFKACLI_BROKERS) {
    console.warn(`To configure kafkat, set the following environment variables (cf. README.md):
    - KAFKACLI_BROKERS
    - KAFKACLI_SSL (optional)
    - KAFKACLI_SASL_MECHANISM (optional)
    - KAFKACLI_SASL_USERNAME (optional)
    - KAFKACLI_SASL_PASSWORD (optional)
    - KAFKACLI_SCHEMA_REGISTRY (optional)`);
      process.exit(-1);
}

yargs(hideBin(process.argv))
    .scriptName('kafkat')
    .command(commands)
    .demandCommand(1)
    .onFinishCommand(() => {
        kafka.disconnect();
    }).argv;
