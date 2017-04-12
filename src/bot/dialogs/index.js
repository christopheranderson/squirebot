const builder = require('botbuilder'),
    request = require('request');
      
const taskAPIHost = process.env.TASKAPIHOST || "http://localhost:7071";


module.exports.dialog = [
    (session, args, next) => {
        //session.send("Hello World");
        const message = session.message.text.toLowerCase();
        if (message === "hello" || message.includes("squire")) {
            builder.Prompts.text(session, "Hello good sir knight! How may I serve you?")    
        } else {
            next({ response: session.message.text });
        }
        
    },
    (session, results) => {
        const task = results.response;

        session.sendTyping();
        const options = {
            "url": `${taskAPIHost}/api/getTask?taskName=${encodeURI(task)}`,
            "json": true
        }
        request(options, (err, response, body) => {
            if (err || response.statusCode != 200) {
                session.endDialog("Sorry, I don't know that task yet. You'll have to train me first!");
                return;
            }
            session.dialogData.task = body;
            session.beginDialog('/handleParameters', {
                index: 0,
                parameters: body.parameters
            });
        })
    },
    (session, results) => {
        if (results && results.parameters && session.dialogData.task && session.dialogData.task.action.type === "url") {
            session.sendTyping();

            const body = {};
            if (results.parameters) {
                for (let parameter of results.parameters) {
                    body[parameter.name] = parameter.value;
                }
            }    

            const options = {
                "url": session.dialogData.task.action.url,
                "json": true,
                "body": body
            }

            request(options, (err, response, body) => {
                if (err || !(response.statusCode >= 200 && response.statusCode <= 204)) {
                    let message = "Sorry, something went wrong";
                    if (body && body.message) {
                        message += ": " + body.message;
                    }
                    
                    session.endDialog(message);
                    return;
                }
                
                if (body && body.message) {
                    if (body.card && body.card === "hero") {
                        const card = new builder.ThumbnailCard(session)
                            .title("Result")
                            .text(body.message)
                        const message = new builder.Message(session).addAttachment(card);
                        session.endDialog(message);
                    } else {
                        session.endDialog(body.message);
                    }
                } else if (response.statusCode == 202) {
                    session.endDialog("I've started that task for you.");
                } else {
                    session.endDialog("I've finished that task for you.");
                }
            })
        } else if (results.response === null) { // It was cancelled, so no need to give a message.
            session.endDialog();
        } else { // Catch all
            session.endDialog("Something went wrong and we're disciplining your squire for you. Please try again.");
        }
    }
]