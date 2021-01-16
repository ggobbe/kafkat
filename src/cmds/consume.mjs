import * as uuid from 'uuid';
import kafka from '../kafka/kafka.mjs';

export default {
    command: 'consume <topic> [--grp]',
    desc: 'Consume message on a topic',
    builder: {},
    handler: async function (argv) {
        const groupId = argv.grp ?? uuid.v4();

        console.log(`Consumer ${groupId} on topic ${argv.topic} - press Ctrl+C to exit\n`);

        let count = 0;
        await kafka.consume(groupId, [argv.topic], (message) => {
            console.log(`[${++count}] ${Buffer.from(message).toString()}`);
        });
    },
};
