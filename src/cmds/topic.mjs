import create from './topic_cmds/create.mjs';
import delete_ from './topic_cmds/delete.mjs';
import list from './topic_cmds/list.mjs';

export default {
    command: 'topic <command>',
    desc: 'Manage topics',
    builder: function (yargs) {
        return yargs.command([create, list, delete_]).demandCommand(1);
    },
    handler: function () {},
};
