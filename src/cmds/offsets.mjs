import display from './offsets_cmds/display.mjs';
import reset from './offsets_cmds/reset.mjs';

export default {
    command: 'offsets <command>',
    desc: 'Manage offsets',
    builder: function (yargs) {
        return yargs.command([display, reset]).demandCommand(1);
    },
    handler: function () {},
};
