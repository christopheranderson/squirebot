const guid = require("guid");
const request = require("request");

const MongoHelper = require("./mongohelper").MongoHelper;

const url = process.env.MONGO_URL;
const TASKS_COLLECTION = "tasks";
const RUNS_COLLECTION = "runs";

const db = new MongoHelper(url);

/**
 * @type {Task[]}
 */
const LOCAL_TASKS = [{
    id: guid.EMPTY,
    etag: guid.EMPTY,
    lastUpdated: Date.now(),
    title: "Fetch me my lance",
    description: "Fetches an ascii lance",
    action: {
        type: "url",
        payload: {
            url: "http://localhost:7071/api/lanceFetcher",
            method: "POST"
        }
    },
    parameters: [
        {
            prompt: "The long one or the short one? (long|short)",
            name: "lance_length"
        },
        {
            prompt: "What material would you live it made of? (wood|metal)",
            name: "lance_material"
        }
    ]
},
{
    id: guid.EMPTY,
    etag: guid.EMPTY,
    lastUpdated: Date.now(),
    title: "generate mosaic",
    description: "Generates photo mosaic",
    action: {
        type: "url",
        payload: {
            url: "http://localhost:7072/api/RequestMosaic",
            method: "POST"
        }
    },
    parameters: [
        {
            prompt: "Source image url?",
            name: "InputImageUrl"
        }
    ]
}
];

/**
 * @typedef {Object} Action
 * @property {string} type
 * @property {Object.<string, string>} payload 
 */

/**
 * @typedef {Object} Parameter
 * @property {string} prompt
 * @property {string} key
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} etag 
 * @property {number} lastUpdated
 * @property {string} title
 * @property {string} user
 * @property {string} description
 * @property {Action} action
 * @property {Parameter[]} parameters
 */

/**
 * @type {TaskService}
 */
let taskServiceSingleton = null;

class TaskService {
    constructor(useInMemory) {
        this.useInMemory = useInMemory;
    }

    /**
     * Gets a singleton of the TaskService
     * @param {boolean} useInMemory 
     * @returns {TaskService}
     */
    static getService(useInMemory) {
        if (taskServiceSingleton === null) {
            taskServiceSingleton = new TaskService(useInMemory === true);
        }
        return taskServiceSingleton;
    }

    /**
     * Gets a specific task by id
     * @param {number} id 
     * @returns {Promise<Task|string>}
     */
    getTask(id) {
        if (this.useInMemory) {
            const task = LOCAL_TASKS.find(task => task.id === id);
            if (!task) {
                return Promise.reject("Not found");
            } else {
                return Promise.resolve(task);
            }

        } else {
            return db.getOne(TASKS_COLLECTION, { id });
        }
    }

    getTaskByName(title) {
        if (this.useInMemory) {
            const task = LOCAL_TASKS.find(task => task.title === title);
            if (!task) {
                return Promise.reject("Not found");
            } else {
                return Promise.resolve(task);
            }
        } else {
            return db.getOne(TASKS_COLLECTION, { title });
        }
    }

    /**
     * Gets count number of items with the specified offset
     * @param {number} count 
     * @param {number} offset 
     * @returns {Promise<Task[]|string>}
     */
    getTasks(count, offset) {
        if (!count) {
            count = 20;
        }

        if (!offset) {
            offset = 0;
        }

        if (this.useInMemory) {
            return Promise.resolve(LOCAL_TASKS.filter((task, index) => {
                return (index >= offset && index < offset + count);
            }));
        } else {
            return db.get(TASKS_COLLECTION, count, offset);
        }
    }

    /**
     * Adds task
     * @param {Task} task
     * @returns {Promise<{id: string, etag: string}|string>}
     */
    addTask(task) {
        /**
         * @type {Task}
         */
        const t = {};
        // Validate task

        t.id = null;
        t.etag = guid.raw();
        t.lastUpdated = Date.now();

        if (!task.title) {
            return Promise.reject("Task invalid: missing title");
        } else {
            t.title = task.title;
        }

        if (!task.description) {
            return Promise.reject("Task invalid: missing description");
        } else {
            t.description = task.description;
        }

        if (!task.action || !task.action.type || !task.action.payload) {
            return Promise.reject("Task invalid: missing or invalid action");
        } else {
            t.action = task.action;
        }

        if (!task.parameters || !(Object.prototype.toString.call(task.parameters) === '[object Array]')) {
            return Promise.reject("Task invalid: parameters must be an array")
        } else {
            t.parameters = task.parameters;
        }

        if (this.useInMemory) {
            t.id = guid.raw();
            LOCAL_TASKS.push(t);
            return Promise.resolve({
                id: t.id,
                etag: t.etag
            });
        } else {
            task.lastUpdated = Date.now();
            task.etag = "new";
            return db.upsert(TASKS_COLLECTION, task);
        }
    }

    /**
     * Updates task
     * @param {Task} task 
     * @returns {Promise<{id: string, etag: string}|string>}
     */
    updateTask(task) {
        if (!task.id) {
            return Promise.reject("Task invalid: id must exist to update");
        }

        if (this.useInMemory) {
            const i = LOCAL_TASKS.findIndex(t => t.id === task.id);
            if (i >= 0 && LOCAL_TASKS[i].etag === task.etag) {
                const old = LOCAL_TASKS[i];
                for (var prop in old) {
                    if (old.hasOwnProperty(prop) && task[prop]) {
                        old[prop] = task[prop];
                    }
                }
                old.etag = guid.raw();
                old.lastUpdated = Date.now();
                LOCAL_TASKS[i] = old;
                return Promise.resolve({ id: old.id, etag: old.etag });
            } else if (i < 0) {
                return Promise.reject("Not found");
            } else if (LOCAL_TASKS[i].etag !== task.etag) {
                return Promise.reject("etag does not match. Update available for object.");
            } else {
                return Promise.reject("Server error");
            }
        } else {
            task.lastUpdated = Date.now();
            return db.upsert(TASKS_COLLECTION, task);
        }
    }

    /**
     * Deletes task by id
     * @param {number} id
     * @param {Task} task
     * @returns {Promise<boolean|string>}
     */
    deleteTask(id, task) {
        if (this.useInMemory) {
            const i = LOCAL_TASKS.findIndex(t => t.id === id);
            if (i >= 0 && task.etag === LOCAL_TASKS[i].etag) {
                LOCAL_TASKS.splice(i, 1);
                return Promise.resolve(true);
            } else if (i >= 0 && task.etag !== LOCAL_TASKS[i].etag) {
                return Promise.reject("Invalid etag");
            } else {
                return Promise.reject("Not found");
            }
        } else {
            throw new Error("Not yet implemented");
        }
    }
}

/**
 * @typedef {Object} RunResponseMessage
 * @property {string} message
 * @property {string} card
 */

/**
 * @typedef {Object} RunResponse
 * @property {boolean} done 
 * @property {number} status
 * @property {RunResponseMessage} body
 */

/**
 * @typedef {Object} Run
 * @property {string} id
 * @property {Task} task
 * @property {RunResponse} response
 * @property {number} created
 * @property {number} lastUpdated
 */

/**
 * @type {TaskRunnerService}
 */
let taskRunnerSingleton = null;

/**
 * @type {Run[]}
 */
const LOCAL_RUNS = [];

class TaskRunnerService {
    constructor(useInMemory) {
        this.useInMemory = useInMemory;
    }

    /**
     * Gets a singleton of the TaskService
     * @param {boolean} useInMemory 
     * @returns {TaskRunnerService}
     */
    static getService(useInMemory) {
        if (taskRunnerSingleton === null) {
            taskRunnerSingleton = new TaskRunnerService(useInMemory === true);
        }
        return taskRunnerSingleton;
    }

    /**
     * Starts a task. Returns a promise with a Run record.
     * @param {Task} task 
     * @param {{parameters: {Object.<string, string>}}} results
     * @returns {Promise<Run|string>}
     */
    startRun(task, results) {

        const options = {
            "url": task.action.payload.url,
            "method": task.action.payload.method
        }
        switch (task.action.payload.method) {
            case "POST":
                const body = {};
                if (results.parameters) {
                    for (let parameter of results.parameters) {
                        body[parameter.name] = parameter.value;
                    }
                }
                options.json = true;
                options.body = body;
                break;
            default:
                return Promise.reject(new Error(`HTTP Method ${task.action.payload.method} not supported`));
                break;
        }

        /**
         * @type {Run}
         */
        const run = {
            id: guid.raw(),
            created: Date.now(),
            lastUpdated: Date.now(),
            task: task,
            response: {
                done: false,
                status: null,
                body: null
            }
        }

        this._upsertRun(run);

        return new Promise((res, rej) => {
            request(options, (err, response, body) => {
                if (err || !(response.statusCode >= 200 && response.statusCode <= 204)) {
                    let message = "Sorry, something went wrong";
                    if (body && body.message) {
                        message += ": " + body.message;
                    }
                    rej(message);
                    return;
                }

                run.response.body = body;
                run.response.status = response.statusCode;
                if (response.statusCode == 200) {
                    run.response.done = true;
                }

                this._upsertRun(run).catch(rej).then(res);
            });
        })
    }

    /**
     * Returns all Runs by a given task id
     * @param {string} taskid 
     * @returns {Promise<Run[]>}
     */
    getRunsByTask(taskid) {
        if (this.useInMemory) {
            run.lastUpdated = Date.now();
            let runs = LOCAL_RUNS.filter(r => r.id === id)
            if (runs) {
                return Promise.resolve(runs);
            } else {
                return Promise.reject(new Error("Not Found"));
            }
        } else {
            return db.getOne(RUNS_COLLECTION, {"task.id": taskid});
        }
    }

    /**
     * Returns a given run by its id
     * @param {string} id 
     * @returns {Promise<Run>}
     */
    getRun(id) {
        if (this.useInMemory) {
            run.lastUpdated = Date.now();
            let run = LOCAL_RUNS.find(r => r.id === id)
            if (run) {
                return Promise.resolve(run);
            } else {
                return Promise.reject(new Error("Not found"));
            }
        } else {
            return db.getOne(RUNS_COLLECTION, {id});
        }
    }

    /**
     * PRIVATE!!!!!!!!!
     * @param {Run} run 
     * @returns {Promise<Run>}
     */
    _upsertRun(run) {
        if (this.useInMemory) {
            run.lastUpdated = Date.now();
            let index = LOCAL_RUNS.findIndex(r => r.id === run.id)
            if (index >= 0) {
                const old = LOCAL_RUNS[index] = run;
            } else {
                LOCAL_RUNS.push(run);
            }
            return Promise.resolve(run);
        } else {
            return db.upsert(RUNS_COLLECTION, run);
        }
    }
}

module.exports = {
    TaskService,
    TaskRunnerService
}
