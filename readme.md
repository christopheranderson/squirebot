# Squirebot

Every knight needs a squire - Squirebot helps you be at your best by doing tasks for you, with only minimal training.

## Getting started locally

There are two apps for squirebot to run:
 - bot (the bot front end)
 - task-simple (Function App that uses an in memory array for bot commands)

You can run the bot by just running `npm start` from the `./src/bot` directory.

You can run the `task-simple` function app via the azure functions cli (`npm i -g azure-functions-cli`) via `func run ./getTask` from the `./src/task-simple` directory.

## License

[MIT](LICENSE)