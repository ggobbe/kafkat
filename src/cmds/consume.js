import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import * as uuid from 'uuid';
import kafka from '../kafka/kafka.js';

export default {
    command: 'consume <topic> [--earliest] [--schema] [--grp=group-id]',
    desc: 'Consume messages on a topic',
    builder: {},
    handler: async function (argv) {
        const groupId = argv.grp ?? `kafkat-${uuid.v4()}`;

        console.log(`Consumer ${groupId} on topic ${argv.topic} - press Ctrl+C to exit\n`);

        const registry = new SchemaRegistry(
            { host: process.env.KAFKAT_SCHEMA_REGISTRY }
            // Temporary fix to prevent errors when consuming from a topic where the subject contains more than one version of the same schema
            // More details on https://github.com/kafkajs/confluent-schema-registry/issues/75
            // { forSchemaOptions: { wrapUnions: false } }
        );

        let count = 0;
        await kafka.consume(
            groupId,
            [argv.topic],
            async (buffer) => {
                try {
                    let message = null;
                    if (buffer) {
                        message = argv.schema ? await registry.decode(buffer) : Buffer.from(buffer).toString();
                    }
                    console.log(`[${++count}] ${message ?? '<NULL>'}`);
                } catch (err) {
                    console.error('error reading message:', err);
                }
            },
            !!argv.earliest // from beginning
        );
    },
};
