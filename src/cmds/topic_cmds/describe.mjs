import kafka from '../../kafka/kafka.mjs';

export default {
    command: 'describe <topic>',
    desc: 'Describe a topic with detailed information',
    builder: {},
    handler: async function (argv) {
        try {
            // Fetch topic metadata
            const metadata = await kafka.fetchTopicMetadata([argv.topic]);

            if (!metadata.topics.length) {
                console.error(`Topic '${argv.topic}' not found`);
                return;
            }

            const topicMetadata = metadata.topics[0];

            // Display topic information
            console.log(`Topic: ${topicMetadata.name}`);
            console.log(`Partitions: ${topicMetadata.partitions.length}`);

            // Display partition details
            console.log('\nPartition Details:');
            console.log('----------------');
            console.log('Partition | Leader | Replicas | ISR');
            console.log('----------------');

            for (const partition of topicMetadata.partitions) {
                console.log(
                    `${partition.partitionId.toString().padEnd(10)} | ` +
                        `${partition.leader.toString().padEnd(7)} | ` +
                        `[${partition.replicas.join(', ')}] | ` +
                        `[${partition.isr.join(', ')}]`
                );
            }

            // Fetch topic offsets
            const offsets = await kafka.fetchTopicOffsets(argv.topic);

            // Display offset information
            console.log('\nOffset Information:');
            console.log('----------------');
            console.log('Partition | Offset | High Watermark');
            console.log('----------------');

            for (const offset of offsets) {
                console.log(
                    `${offset.partition.toString().padEnd(10)} | ` +
                        `${offset.offset.toString().padEnd(7)} | ` +
                        `${offset.high || 'N/A'}`
                );
            }
        } catch (error) {
            console.error(`Error describing topic: ${error.message}`);
        }
    },
};
