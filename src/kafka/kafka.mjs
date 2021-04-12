import { Kafka } from 'kafkajs';
import { config } from './config.mjs';

const MAX_IN_FLIGHT_REQUESTS = null; // e.g. 1
const AUTO_COMMIT_THRESHOLD = null; // e.g. 100
const ACKS = -1;

const kafka = new Kafka(config);
const kafkaAdmin = kafka.admin();
let kafkaProducer;

async function listTopics() {
    return await kafkaAdmin.listTopics();
}

async function createTopic(topic, topicConfig) {
    return await kafkaAdmin.createTopics({
        topics: [
            {
                topic,
                ...topicConfig,
            },
        ],
    });
}

async function deleteTopic(topic) {
    // only allow delete one by one to prevent timeout
    return await kafkaAdmin.deleteTopics({ topics: [topic], timeout: 10000 });
}

async function fetchTopicOffsets(topic) {
    return await kafkaAdmin.fetchTopicOffsets(topic);
}

async function fetchOffsets(groupId, topic) {
    return await kafkaAdmin.fetchOffsets({ groupId: groupId, topic: topic });
}

async function resetOffsets(groupId, topic, earliest) {
    return await kafkaAdmin.resetOffsets({ groupId, topic, earliest });
}

async function setRetentionMs(topic) {
    console.log(`>>> TOPIC: ${topic}`)
    const config1 = await kafkaAdmin.describeConfigs({
        includeSynonyms: false,
        resources: [
            {
                type: 2, // TOPIC
                name: topic,
            },
        ],
    });

    config1.resources[0].configEntries.forEach((ce) => {
        if (ce.configName.match(/retention/)) {
            console.log(JSON.stringify(ce));
        }
    });

    console.log('================= Updating ...');
    await kafkaAdmin.alterConfigs({
        resources: [
            {
                type: 2,
                name: topic,
                configEntries: [{ name: 'retention.ms', value: '86400000' }],
            },
        ],
    });

    console.log('UPDATED =================');

    const config2 = await kafkaAdmin.describeConfigs({
        includeSynonyms: false,
        resources: [
            {
                type: 2, // TOPIC
                name: topic,
            },
        ],
    });

    config2.resources[0].configEntries.forEach((ce) => {
        if (ce.configName.match(/retention/)) {
            console.log(JSON.stringify(ce));
        }
    });
}

async function listGroups() {
    return (await kafkaAdmin.listGroups()).groups;
}

async function describeGroup(groupId) {
    return await kafkaAdmin.describeGroups([groupId]);
}

async function produce(topic, key, buffer) {
    if (!kafkaProducer) {
        kafkaProducer = kafka.producer({
            maxInFlightRequests: MAX_IN_FLIGHT_REQUESTS,
            allowAutoTopicCreation: false,
        });
        await kafkaProducer.connect();
    }

    await kafkaProducer.send({
        topic,
        messages: [{ key: key, value: buffer }],
        acks: ACKS,
    });
}

async function consume(groupId, topics, handler, fromBeginning = false) {
    const consumer = kafka.consumer({
        groupId: groupId,
    });

    await consumer.connect();

    const topicPromises = topics.map(async (topic) => {
        await consumer.subscribe({ topic: topic, fromBeginning: fromBeginning });
    });

    await Promise.all(topicPromises);

    await consumer.run({
        autoCommitThreshold: AUTO_COMMIT_THRESHOLD,
        eachMessage: async (payload) => {
            await handler(payload.message.value);
        },
    });
}

async function disconnect() {
    await kafkaAdmin.disconnect();
    await kafkaProducer?.disconnect();
}

export default {
    createTopic,
    listTopics,
    deleteTopic,
    fetchTopicOffsets,
    fetchOffsets,
    listGroups,
    describeGroup,
    produce,
    resetOffsets,
    consume,
    disconnect,
    setRetentionMs,
};
