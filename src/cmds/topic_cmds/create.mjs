import kafka from '../../kafka/kafka.mjs';

export default {
    command: 'create <name> [--part] [--repl]',
    desc: 'Create topic',
    builder: {},
    handler: async function (argv) {
        const success = await kafka.createTopic(argv.name, {
            numPartitions: argv.part || 6,
            replicationFactor: argv.repl || 1,
        });

        if(success) {
            console.log(`topic created: ${argv.name}`);
        } else {
            console.log(`error on creating topic: ${argv.name}`);
        }
    },
};
