'use strict'
const todo = require('./index.js');
const assert = require('assert');

const todo1 = "buy note";
const todo2 = "attend meeting";
const todo3 = "fix for comment in PR2";

todo.todo(todo1);
todo.todo(todo2);
todo.todo(todo3);

assert.deepEqual(todo.notDoneList(), [todo1, todo2, todo3]);

todo.done(todo1);
assert.deepEqual(todo.doneList(), [todo1])
assert.deepEqual(todo.notDoneList(), [todo2, todo3])

todo.del(todo1)
todo.del(todo2)
todo.del(todo3)

assert.deepEqual(todo.doneList(), [])
assert.deepEqual(todo.notDoneList(), [])

console.log('test finished')