import { Kafka } from 'kafkajs';
import { config } from './config.mjs';

const kafka = new Kafka(config);
const kafkaAdmin = kafka.admin();

async function listTopics() {
    return await kafkaAdmin.listTopics();
}

async function deleteTopics(topics) {
    return await kafkaAdmin.deleteTopics({ topics: topics });
}

async function disconnect() {
    await kafkaAdmin.disconnect();
}

export default {
    listTopics,
    deleteTopics,
    disconnect,
};
