const Tasks = require("../lib/tasks").Tasks;

const tasks = new Tasks();

module.exports = function (context, req) {
    context.log("Query: " + JSON.stringify(req.query));

    if (req.query.taskName || (req.body && req.body.taskName)) {
        const task = tasks.getTask((req.query.taskName || req.body.taskName));

        if (!task) {
            context.res = {
                status: 404,
                body: {
                    error: "No task with that name"
                }
            }
        } else {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: task
            };
        }
    }
    else {
        context.res = {
            status: 400,
            body: {
                error: "Please specify task name with 'taskName' parameter"
            }
        };
    }
    context.done();
};