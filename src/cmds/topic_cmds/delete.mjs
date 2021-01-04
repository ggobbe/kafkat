import kafka from '../../kafka/kafka.mjs';

export default {
    command: 'delete <name> [names..]',
    desc: 'Delete topics',
    builder: {},
    handler: async function (argv) {
        const topics = [].concat(argv.name).concat(argv.names);
        await kafka.deleteTopics(topics);
        console.log(`topics deleted: ${topics.join(', ')}`);
    },
};
