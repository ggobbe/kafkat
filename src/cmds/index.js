import avroTs from './avro-ts.js';
import consume from './consume.js';
import consumerGroup from './consumerGroup.js';
import offsets from './offsets.js';
import produce from './produce.js';
import topic from './topic.js';

export const commands = [topic, produce, consume, avroTs, offsets, consumerGroup];
