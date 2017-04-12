
const tasks = {
    "fetch me my lance": {
        "action": {
            "type": "url",
            "url": process.env.LANCEFETCHERAPI || "http://localhost:7071/api/lanceFetcher",
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
    },
    "add github issue": {
        "action":{
            "type":"url",
            "url": process.env.LOGICAPPURL,
            "method": "POST"
        },
        "parameters": [
            {
                "prompt":"What's the title of your issue?",
                "name":"issue_title"
            },
            {
                "prompt":"What's the description of your issue?",
                "name":"issue_description"
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

