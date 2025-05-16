import create from './topic_cmds/create.js';
import delete_ from './topic_cmds/delete.js';
import list from './topic_cmds/list.js';

export default {
    command: 'topic <command>',
    desc: 'Manage topics',
    builder: function (yargs) {
        return yargs.command([create, list, delete_]).demandCommand(1);
    },
    handler: function () {},
};
