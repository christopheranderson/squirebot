# Squirebot

Every knight needs a squire - Squirebot helps you be at your best by doing tasks for you, with only minimal training.

## Prerequisites

## Required
- Node v6.5.0
- npm (comes with Node)

## Recommended
- [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v3.5.31)
- [VS Code](https://code.visualstudio.com/download)

## Getting started locally

### Quick start

🔥🔥🔥 WINDOWS ONLY 🔥🔥🔥

1. Clone the repo
2. Run `./start.ps1` from the root of this project

This will spin up two powershell windows and when everything is loaded, it will start chrome.

### Manually

1. Clone the repo

#### Functions

```shell
cd ./src/tasks-functions
npm i
npm start
```

`npm start` will run the `func host start --cors *` command

This should spin up the Function host

#### Web App

```shell
cd ./src/webapp
npm i
npm start
```

This should spin up a local site hosting the static Angular content

When it has finished building, open up your favorite browser to "http://localhost:4200"

## Task API Documentation

Squirebot uses HTTP to make requests to Task providers. These requests expect a certain format for the response.

### Request

The request sent to your API will be a POST with a simple dictionary of keys sent as the body.

```json
{
    "name1":"value",
    "name2":"value"
}
```

### Response

The response returned from your task needs to have a status code of `200`. If you want to display text to the user, you can return a JSON body with a `message` property. The content of `message` will generally be treated like markdown.

```json
{
    "message":"# Hello world!"
}
```

### Example

This is a simple example of creating a hello world task

1. Create a new http Function (`func new -l javascript -t HttpTrigger -n hello`)
2. Use this code for `./hello/index.js`
    ```javascript
        module.exports = function (context, req) {
        context.log('JavaScript HTTP trigger function processed a request.');

        if (req.query.name || (req.body && req.body.name)) {
            context.log('Sending response to bot!');
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: {message: "# Hello222 " + (req.query.name || req.body.name)+ "!!!!"}
            };
        }

        context.done();
    };
    ```
3. Create a new task in the portal UI
4. Name it `hello world`
5. Make the action `http://localhost:7071/api/hello` with the method as `POST`
6. Create a parameter with the name as `name` and prompt as `What is your name?`
7. Hit save and then open the bot emulator
8. In bot emulator: set the url to `http://localhost:7071/api/bot`
9. Tell the bot: `hello world`
10. It should ask "What is your name?"
11. Answer with your name
12. It should say "Hello `<name>`"

## License

[MIT](LICENSE)