import { avdlToAVSCAsync, COMPATIBILITY, readAVSCAsync, SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import path from 'path';
import kafka from '../kafka/kafka.mjs';

export default {
    command: 'produce <topic> <message> [--avdl=schema.avdl] [--avsc=schema.avsc] [--num=1]',
    desc: 'Produce message on a topic',
    builder: {},
    handler: async function (argv) {
        let buffer = null;

        if (argv.avdl || argv.avsc) {
            const payload = JSON.parse(argv.message);

            const registry = new SchemaRegistry(
                { host: process.env.KAFKACLI_SCHEMA_REGISTRY },
                { forSchemaOptions: { wrapUnions: false } }
            );

            let schema = null;
            if (argv.avdl) {
                schema = await avdlToAVSCAsync(path.join(argv.avdl));
            } else {
                schema = await readAVSCAsync(argv.avsc);
            }

            const { id } = await registry.register(schema, {
                compatibility: COMPATIBILITY.BACKWARD,
                subject: `${argv.topic}-value`,
            });
            buffer = await registry.encode(id, payload);
        } else {
            buffer = Buffer.from(argv.message);
        }

        const times = argv.num ?? 1;

        let count = 0;
        for (let i = 0; i < times; i++) {
            console.log(`[${++count}] sending to ${argv.topic}: ${argv.message}`);
            await kafka.produce(argv.topic, null, buffer);
        }
    },
};
