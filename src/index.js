import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { commands } from './cmds/index.mjs';
import kafka from './kafka/kafka.mjs';

yargs(hideBin(process.argv))
    .scriptName('kafka-cli')
    .command(commands)
    .demandCommand(1)
    .onFinishCommand(() => {
        kafka.disconnect();
    }).argv;
