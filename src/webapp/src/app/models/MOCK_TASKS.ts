import { ITask } from "./task";

export const tasks: ITask[] = [];

tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});

tasks.push({
    id: "3",
    title: "REAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALY LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOONG TITLE",
    description: `
    Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum ullamcorper rutrum. 

    Etiam aliquam sem ac velit feugiat elementum. Nunc eu elit velit, nec vestibulum nibh. Curabitur ultrices, diam non ullamcorper blandit, nunc lacus ornare nisi, egestas rutrum magna est id nunc. Pellentesque imperdiet malesuada quam, et rhoncus eros auctor eu. Nullam vehicula metus ac lacus rutrum nec fermentum urna congue. Vestibulum et risus at mi ultricies sagittis quis nec ligula. Suspendisse dignissim dignissim luctus. Duis ac dictum nibh. Etiam id massa magna. Morbi molestie posuere posuere.     
    `,
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
tasks.push({
    id: "1",
    title: "fetch me my lance",
    description: "Prints out an ASCII art lance",
    action: {
        type: "url",
        payload: {
            "url": "https://localhost:7071/api/lanceFetcher",
            "method": "POST"
        }
    },
    parameters: [{
        prompt: "The long one or the short one? (long|short)",
        name: "lance_length"
    },
    {
        prompt: "What material would you live it made of? (wood|metal)",
        name: "lance_material"
    }]
});

tasks.push({
    id: "2",
    title: "broken",
    description: "Should gracefully handle misformed data",
    action: {
        type: "unkown",
        payload: {
            "hello": "world"
        }
    },
    parameters: []
});
