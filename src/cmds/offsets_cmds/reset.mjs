import kafka from '../../kafka/kafka.mjs';

export default {
    command: 'reset <groupId> <topic> [--earliest]',
    desc: 'Resets the consumer group offset to the earliest or latest offset (latest by feault)',
    builder: {},
    handler: async function (argv) {
        try {
            await kafka.resetOffsets(argv.groupId, argv.topic, !!argv.earliest);
            console.log('Consumer group reset successfully');
        } catch (err) {
            console.error('Error resetting consumer group', err);
        }
    },
};