const tasks = {
    "fetch me my lance": {
        "action": {
            "type": "url",
            "url": "http://localhost:7071/api/lanceFetcher",
            "method": "POST"
        },
        "parameters": [
            {
                "prompt": "The long one or the short one? (long|short)",
                "name": "lance_length"
            },
            {
                "prompt": "What material would you live it made of? (wood|metal)",
                "name": "lance_material"
            }
        ]
    }
};


module.exports.Tasks = class Tasks {
    getTask(taskName) {
        if (tasks[taskName]) {
            return tasks[taskName];
        } else {
            return false;
        }
    }
}

