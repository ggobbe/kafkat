import progress from 'cli-progress';
import pad from 'pad';
import kafka from '../../kafka/kafka.js';

async function displayLagPerPartition(groupId, topic) {
    const topicOffsets = await kafka.fetchTopicOffsets(topic);
    const offsets = await kafka.fetchOffsets(groupId, topic);
    const padding = topicOffsets.length.toString().length; // 15 partitions -> padding 2, 104 partitions -> padding 3

    for (const topicOffset of topicOffsets.sort((a, b) => (a.partition < b.partition ? -1 : 1))) {
        const currentOffset = offsets.find((o) => o.partition == topicOffset.partition).offset;
        const formatTemplate = `${topic}[${pad(padding, topicOffset.partition.toString())}] {bar} {value}/{total}`;
        const format = +currentOffset < +topicOffset.offset ? formatTemplate.red : formatTemplate;
        const bar = new progress.SingleBar(
            {
                format: format,
            },
            progress.Presets.rect
        );
        bar.start(topicOffset.offset, currentOffset);
        bar.stop();
    }
}

async function displayLagPerTopic(groupId, topics) {
    const progressBar = new progress.SingleBar({ clearOnComplete: true }, progress.Presets.shades_classic);
    progressBar.start(topics.length, 0);

    const results = [];
    for (const topic of topics) {
        const topicOffsets = await kafka.fetchTopicOffsets(topic);
        const offsets = await kafka.fetchOffsets(groupId, topic);

        if (offsets.some((o) => o.offset >= 0)) {
            const sumTopicOffsets = topicOffsets.reduce((total, current) => total + +current.offset, 0);
            const sumOffsets = offsets
                .filter((o) => +o.offset >= 0)
                .reduce((total, current) => total + +current.offset, 0);
            results.push({ topic: topic, topicOffset: sumTopicOffsets, offset: sumOffsets });
        }
        progressBar.increment(1);
    }
    progressBar.stop();

    const padding = results.reduce((max, current) => Math.max(max, current.topic.length), 0);

    for (const result of results.sort((a, b) => (a.topic < b.topic ? -1 : 1))) {
        const formatTemplate = `${pad(result.topic, padding)} {bar} {value}/{total}`;
        const format = result.offset < result.topicOffset ? formatTemplate.red : formatTemplate;
        const bar = new progress.SingleBar({ format: format }, progress.Presets.rect);
        bar.start(result.topicOffset, result.offset);
        bar.stop();
    }
}

export default {
    command: 'display <groupId> [--topic] [--regex]',
    desc: 'Get consumer group offsets regarding given topics',
    builder: {},
    handler: async function (argv) {
        if (argv.topic) {
            await displayLagPerPartition(argv.groupId, argv.topic);
        } else if (argv.regex) {
            const topics = (await kafka.listTopics()).filter((t) => t.match(argv.regex));
            await displayLagPerTopic(argv.groupId, topics);
        }
    },
};
