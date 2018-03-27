var path = require('path')
var hook = require('require-in-the-middle')

// Hook into the express and mongodb module
hook(['http'], function (exports, name, basedir) {
    if (name == 'http') {
        var request_origin = exports.request;
        exports.request = function (options, callback) {
            // before
            options.headers['traceId'] = 'testTraceId';
            var callback_origin = callback;
            // execute
            return request_origin(options, function (response) {
                console.log("status code : " + response.statusCode);
                callback_origin(response);
            });
            // after
        };

        var origin_createServer = exports.createServer;
        exports.createServer = function (handler) {
            var originHandler = handler;
           return origin_createServer(function (request, response) {
                //before
                console.log(request.headers);
                //execute
                originHandler(request, response);
                //after
            });
        }
    }
    
    return exports;
})