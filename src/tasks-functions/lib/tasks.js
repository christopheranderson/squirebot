const mongodb = require('mongodb');
const guid = require("guid");

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
            url: "http://localhost:7071/api/fetchLance",
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
}];

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
            throw new Error("Not yet implemented");
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
            return Promise.reject("Not yet implemented");
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
            return Promise.reject("Not yet implemented");
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
            throw new Error("Not yet implemented");
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

module.exports = {
    TaskService
}