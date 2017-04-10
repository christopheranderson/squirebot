var restify = require('restify');
var builder = require('botbuilder');

const indexDialog = require('./dialogs/index').dialog;
const handleParametersDialog = require('./dialogs/handleParameters').dialog;

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', indexDialog);

bot.dialog('/handleParameters', handleParametersDialog).cancelAction("cancelParameters", "Canceled the task, sire", {
    matches: /^!cancel/i,
    confirmPrompt: "Are you sure?"
});