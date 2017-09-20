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