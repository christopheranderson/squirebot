const connector = require('../lib/bot').connector;

var response = function (context) {
    let _status = 200;
    return {
        send: function (status, message) {
            context.log('Send called!');
            var _msg = message ? message : (typeof status !== 'number' ? status : null)
            var _status = typeof status === 'number' ? status : 200
            var res = {
                status: _status,
                body: _msg
            };
            context.res = res;
            context.done();
        },
        status: function(status) {
            context.log('Status called!');
            _status = status;
        },
        end: function(message) {
            context.log('end called');
            var _msg = message;
            var res = {
                status: _status,
                body: _msg
            };
            context.res = res;
            context.done();
        }
    }
}

const listen = connector.listen();

module.exports = function (context, req) {
    context.log('New request received!');
    // Fetch most up to date bot
    listen(req, response(context));
};