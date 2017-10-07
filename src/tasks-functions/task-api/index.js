const { TaskService } = require("../lib/tasks");

const taskService = TaskService.getService(process.env.UseInMemoryStore === "true");

/**
 * Main method for the function
 * @param {HTTPContext} context 
 * @param {Request} req 
 */
function run(context, req) {
    context.log('task-api received a request');
    context.log(JSON.stringify(context.req
        , (key, value) => {
            if (typeof value === "function") {
                return "(function)";
            } else {
                return value;
            }
        }));

    switch (context.req.method) {
        case "GET":
            if (context.bindingData.id) {
                taskService.getTask(context.bindingData.id)
                    .catch(results => {
                        context.res.status(404).json({ message: results });
                    })
                    .then(results => {
                        context.res.status(200).json(results);
                    });
            } else {
                const count = context.req.query.count;
                const offset = context.req.query.offset;
                const name = context.req.query.name;

                if (name) {
                    taskService.getTaskByName(name)
                        .catch(results => {
                            context.res.status(404).json({ message: results });
                        })
                        .then(results => {
                            context.res.status(200).json(results);
                        });
                } else {
                    taskService.getTasks(count, offset)
                        .catch(results => {
                            context.res.status(400).json({ message: results });
                        })
                        .then(results => {
                            context.res.status(200).json(results);
                        });
                }
            }
            break;
        case "POST":
            if (context.bindingData.id) {
                taskService.updateTask(context.req.body)
                    .catch(results => {
                        context.res.status(404).json({ message: results });
                    })
                    .then(results => {
                        context.res.status(200).json(results);
                    });
            } else {
                taskService.addTask(context.req.body)
                    .catch(results => {
                        context.res.status(400).json({ message: `Malformed task` });
                    })
                    .then(results => {
                        context.res.status(201).json(results);
                    });
            }
            break;
        case "PUT":
            taskService.addTask(context.req.body)
                .catch(results => {
                    context.res.status(400).json({ message: results });
                })
                .then(results => {
                    context.res.status(201).json(results);
                });
            break;
        case "DELETE":
            if (context.bindingData.id) {
                taskService.deleteTask(context.bindingData.id, context.req.body)
                    .catch(results => {
                        context.res.status(404).json({ message: results });
                    })
                    .then(results => {
                        context.res.status(204).end();
                    });
            } else {
                context.res.status(400).json({ message: `Please specify an id when posting` });
            }
            break;
    }
};

module.exports = run;



/**
 * @typedef {Object} Request
 * @property {Object.<string, string>} query
 * @property {Object.<string, string>} headers
 * @property {function(string): string} get
 * @property {*} body
 */

/**
 * @typedef {Object} Response
 * @property {function(*): response} raw
 * @property {function(string, string): Response} setHeader
 * @property {function(string, string): Response} header
 * @property {function(string, string): Response} set
 * @property {function(string): string} getHeader
 * @property {function(string): string} get
 * @property {function(string): Response} removeHeader
 * @property {function(string | object | buffer): Response} end
 * @property {function(string | object | buffer): Response} send
 * @property {function(number): Response} status
 * @property {function(number): Response} sendStatus
 * @property {function(string): Response} type
 * @property {function(Object): Response} json
 */

/**
 * @typedef {Object} FunctionContext
 * @property {function(string)} log
 * @property {function(err, results)} done
 * @property {Object.<string, *>} bindings
 * @property {Object.<string, *>} bindingData
 */

/**
 * @typedef HTTPContext
 * @type {FunctionContext} 
 * @property {Request} req
 * @property {Response} res
 */