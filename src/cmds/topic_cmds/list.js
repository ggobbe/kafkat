import kafka from '../../kafka/kafka.js';

export default {
    command: 'list [regex] [--json]',
    desc: 'List topics',
    builder: {},
    handler: async function (argv) {
        let topics = await kafka.listTopics();

        if (argv.regex) {
            topics = topics.filter((t) => t.match(argv.regex));
        }

        if (argv.json) {
            console.log(JSON.stringify(topics));
        } else {
            for (let topic of topics) {
                console.log(topic);
            }
        }
    },
};
