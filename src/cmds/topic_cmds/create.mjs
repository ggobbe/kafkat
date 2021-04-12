import kafka from '../../kafka/kafka.mjs';

export default {
    command: 'create',
    desc: 'Create topic',
    builder: {},
    handler: async function (argv) {
        // const success = await kafka.createTopic(argv.name, {
        //     numPartitions: argv.part || 6,
        //     replicationFactor: argv.repl || 1,
        // });

        // if(success) {
        //     console.log(`topic created: ${argv.name}`);
        // } else {
        //     console.log(`error on creating topic: ${argv.name}`);
        // }

        await kafka.setRetentionMs('alpha.projections.documents');
        await kafka.setRetentionMs('alpha.projections.issues');
        await kafka.setRetentionMs('alpha.projections.people');
        await kafka.setRetentionMs('alpha.projections.projects');
        await kafka.setRetentionMs('alpha.projections.tasks');
        await kafka.setRetentionMs('alpha.projections.todolists');
    },
};
