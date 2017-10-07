var restify = require('restify');

const connector = require('./bot').connector;

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Attach connector
server.post('/api/messages', connector.listen());