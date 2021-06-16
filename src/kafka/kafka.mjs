import { Kafka } from 'kafkajs';
import { config } from './config.mjs';

const MAX_IN_FLIGHT_REQUESTS = null; // e.g. 1
const AUTO_COMMIT_THRESHOLD = null; // e.g. 100
const ACKS = -1;

const kafka = new Kafka(config);
const kafkaAdmin = kafka.admin();
let kafkaProducer;
const consumers = new Map();

registerExitSignals();

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
    consumers.set(groupId, consumer);

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

async function deleteSingleConsumerGroup(groupId) {
  return await kafkaAdmin.deleteGroups([groupId]);
}

async function deleteConsumerGroups() {
    for await (let [groupId, consumer] of consumers) {
        console.log(`\nDeleting consumer group: ${groupId}`);

        await consumer.disconnect();
        console.log('✓ disconnected');

        await kafkaAdmin.deleteGroups([groupId]);
        console.log('✓ deleted');
    }
}

async function disconnect() {
    await kafkaAdmin.disconnect();
    await kafkaProducer?.disconnect();
}

async function registerExitSignals() {
    const errorTypes = ['unhandledRejection', 'uncaughtException'];
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

    errorTypes.map((type) => {
        process.on(type, async (e) => {
            try {
                console.log(`process.on ${type}`);
                console.error(e);
                await deleteConsumerGroups();
                process.exit(0);
            } catch (_) {
                process.exit(1);
            }
        });
    });

    signalTraps.map((type) => {
        process.once(type, async () => {
            try {
                await deleteConsumerGroups();
            } finally {
                process.kill(process.pid, type);
            }
        });
    });
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
    deleteSingleConsumerGroup,
};
