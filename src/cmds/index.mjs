import avroTs from './avro-ts.mjs';
import consume from './consume.mjs';
import offsets from './offsets.mjs';
import produce from './produce.mjs';
import topic from './topic.mjs';

export const commands = [topic, produce, consume, avroTs, offsets];
