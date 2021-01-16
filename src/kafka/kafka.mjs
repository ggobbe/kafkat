import { Kafka } from 'kafkajs';
import { config } from './config.mjs';

const MAX_IN_FLIGHT_REQUESTS = 1;
const AUTO_COMMIT_THRESHOLD = 1;
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

async function deleteTopics(topics) {
    return await kafkaAdmin.deleteTopics({ topics: topics });
}

async function produce(topic, key, message) {
    if (!kafkaProducer) {
        kafkaProducer = kafka.producer({
            maxInFlightRequests: MAX_IN_FLIGHT_REQUESTS,
            allowAutoTopicCreation: false,
        });
        await kafkaProducer.connect();
    }

    await kafkaProducer.send({
        topic,
        messages: [{ key: key, value: message }],
        acks: ACKS,
    });
}

async function consume(groupId, topics, handler) {
    const consumer = kafka.consumer({
        groupId: groupId,
    });

    await consumer.connect();

    const topicPromises = topics.map(async (topic) => {
        await consumer.subscribe({ topic: topic, fromBeginning: true });
    });

    await Promise.all(topicPromises);

    await consumer.run({
        autoCommitThreshold: AUTO_COMMIT_THRESHOLD,
        eachMessage: async (payload) => await handler(payload.message.value),
    });
}

async function disconnect() {
    await kafkaAdmin.disconnect();
    await kafkaProducer?.disconnect();
}

export default {
    createTopic,
    listTopics,
    deleteTopics,
    produce,
    consume,
    disconnect,
};
