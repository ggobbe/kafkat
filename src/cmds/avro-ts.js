import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { avroToTypeScript } from 'avro-typescript';
import fs from 'node:fs';
import process from 'node:process';

export default {
    command: 'avro-ts [--registryId] [--subject] [--avsc]',
    desc: 'Create typescript interface from avro schema in schema registry',
    builder: {},
    handler: async function (argv) {
        if (argv.registryId || argv.subject) {
            const registry = new SchemaRegistry(
                { host: process.env.KAFKAT_SCHEMA_REGISTRY },
                { forSchemaOptions: { wrapUnions: false } }
            );

            const schemaId = argv.registryId ? argv.registryId : await registry.getLatestSchemaId(argv.subject);
            const schema = await registry.getSchema(schemaId);
            console.log(avroToTypeScript(JSON.parse(JSON.stringify(schema))));
        } else if (argv.avsc) {
            const schemaText = fs.readFileSync(argv.avsc, 'UTF8');
            const schema = JSON.parse(schemaText);
            console.log(avroToTypeScript(schema));
        }
    },
};
