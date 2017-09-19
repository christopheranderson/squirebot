const builder = require('botbuilder');

module.exports.dialog = [
    (session, args, next) => {
        if (args && args.parameters && args.parameters.length && args.index != undefined && args.index < args.parameters.length) {
            session.dialogData.parameters = args.parameters;
            session.dialogData.index = args.index;
            builder.Prompts.text(session, args.parameters[args.index].prompt);
        } else {
            if (args && args.parameters) {
                session.endDialogWithResult({ parameters: args.parameters });
            } else {
                session.endDialog();
            }

        }
    },
    (session, results, next) => {
        session.dialogData.parameters[session.dialogData.index].value = results.response;
        session.replaceDialog('/handleParameters', {
            parameters: session.dialogData.parameters,
            index: ++session.dialogData.index
        });
    }
]