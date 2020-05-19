'use strict'

const tasks = new Array();

/**
 * TODOを追加する
 * @param {string} task
 */
function todo(task) {
    tasks.push({name: task, state: false});
}

/**
 * タスクが完了したかどうかを返す
 * @param {object} taskAndIsDonePair
 * @return {boolean} 完了したかどうか
 */
function isDone(taskAndIsDonePair) {
    return taskAndIsDonePair.state;
}

/**
 * タスクが完了していないかどうかを返す
 * @param {object} taskAndIsDonePair
 * @return {boolean} 完了していないかどうか
 */
function isNotDone(taskAndIsDonePair) {
    return !isDone(taskAndIsDonePair);
}

/**
 * 未完了のタスク一覧を取得する
 * @return {array}
 */
function notDoneList() {
    return tasks.filter(task => isNotDone(task)).map(t => t.name)
}

/**
 * 完了のタスク一覧を取得する
 * @return {array}
 */
function doneList() {
    return tasks.filter(task => isDone(task)).map(t => t.name)
}

/**
 * タスク一覧を取得する
 * @return {array}
 */
function list() {
    return tasks.map(t => t.name)
}


/**
 * taskを完了状態にする
 * @param {string} taskName
 */
function done(taskName) {
    const indexFound = tasks.findIndex(t => t.name === taskName);
    if (indexFound != -1) {
        tasks[indexFound].state = true;
    }
}

/**
 * 項目の削除
 * @param {string} taskName
 */
function del(taskName) {
    const indexFound = tasks.findIndex(t => t.name === taskName);
    if (indexFound != -1) {
        tasks.splice(indexFound, 1)
    }
}

module.exports = {todo, done, list, doneList, notDoneList, del};