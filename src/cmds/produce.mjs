import kafka from '../kafka/kafka.mjs';

export default {
    command: 'produce <topic> <message> [--num=1]',
    desc: 'Produce message on a topic',
    builder: {},
    handler: async function (argv) {
        if (argv.num) {
            let count = 0;
            for (let i = 0; i < argv.num; i++) {
                console.log(`[${++count}] sending to ${argv.topic}: ${argv.message}`);
                await kafka.produce(argv.topic, null, Buffer.from(argv.message));
            }
        } else {
            await kafka.produce(argv.topic, undefined, Buffer.from(argv.message));
            console.log('message sent');
        }
    },
};
