// Description:
//   TODO を管理することができるボットです
// Commands:
//   ボット名 todo     - TODO を作成
//   ボット名 done     - TODO を完了にする
//   ボット名 del      - TODO を消す
//   ボット名 list     - TODO の一覧表示
//   ボット名 donelist - 完了した TODO の一覧表示
'use strict';

const todo = require('todo');
console.log(todo.list());

module.exports = robot => {
    robot.respond(/todo (.+)/i, msg => {
        const task = msg.match[1].trim();
        todo.todo(task);
        msg.send('追加したお: ' + task);
    });

    robot.respond(/done (.+)/i, msg => {
        const task = msg.match[1].trim();
        todo.done(task);
        msg.send('完了したお: ' + task);
    });

    robot.respond(/del (.+)/i, msg => {
        const task = msg.match[1].trim();
        todo.del(task);
        msg.send('削除したお: ' + task);
    });

    robot.respond(/list/i, msg => {
        msg.send(todo.list().join('\n'));
    });

    robot.respond(/donelist/i, msg => {
        msg.send(todo.doneList().join('\n'));
    });
};
