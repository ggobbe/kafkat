import kafka from '../../kafka/kafka.js';

export default {
    command: 'delete <group-id>',
    desc: 'Delete consumer group',
    builder: {},
    handler: async function (argv) {
        const groupId = argv['group-id'];

        try {
            await kafka.deleteSingleConsumerGroup(groupId);

            console.log(`✓ consumer group deleted (${groupId})`);
        } catch (e) {
            console.error(`✘ error deleting consumer group ${groupId}: `, e?.groups?.[0].error?.message);
        }
    },
};
