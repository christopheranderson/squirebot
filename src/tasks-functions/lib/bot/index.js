var builder = require('botbuilder');

// Import dialogs
const indexDialog = require('./dialogs/index').dialog;
const handleParametersDialog = require('./dialogs/handleParameters').dialog;

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

//=========================================================
// Bots Dialogs Setup
//=========================================================

bot.dialog('/', indexDialog);

bot.dialog('/handleParameters', handleParametersDialog).cancelAction("cancelParameters", "Canceled the task, sire", {
    matches: /^!cancel/i,
    confirmPrompt: "Are you sure?"
});

module.exports.connector = connector;   
