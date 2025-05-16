import kafka from '../../kafka/kafka.js';

export default {
    command: 'delete <name> [names..]',
    desc: 'Delete topics',
    builder: {},
    handler: async function (argv) {
        let toDeleteTopic = []
            .concat(argv.name)
            .concat(argv.names)
            .filter((t) => t);

        let ignored;
        if (toDeleteTopic.length > 1 && toDeleteTopic.find((t) => t.startsWith('_'))) {
            ignored = toDeleteTopic.filter((t) => t.startsWith('_'));
            toDeleteTopic = toDeleteTopic.filter((t) => !t.startsWith('_'));
        }

        const existingTopic = await kafka.listTopics();

        for await (let topic of toDeleteTopic) {
            if (existingTopic.includes(topic)) {
                await kafka.deleteTopic(topic);
                console.log(`✓ topic deleted: ${topic}`);
            } else {
                console.log(`✗ topic not found: ${topic}`);
            }
        }

        if (ignored) {
            ignored.forEach((t) => console.log(`ignored:\t${t}`));
            console.warn('\nWarning: system topics are ignored when deleting more than one topic');
        }
    },
};
