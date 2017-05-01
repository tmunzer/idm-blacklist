const https = require('https');
const host = "idmanager.aerohive.com";
const baseUrl = "/idmanager/API/external/";
/**
 * HTTP GET Request
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {String} path - path to request the ACS endpoint
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account clientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 *  */
module.exports.GET = function (token, path, callback) {
    var options = {
        host: host,
        port: 443,
        path: baseUrl + path,
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'x-header-token': token            
        }
    };
    httpRequest(options, callback);
};
/**
 * HTTP POST Request
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {String} path - path to request the ACS endpoint
 * @param {Object} data - data to include to the POST Request
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account clientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 *  */
module.exports.POST = function (token, path, data, callback) {
    var options = {
        host: host,
        port: 443,
        path: baseUrl + path,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'x-header-token': token            
        }
    };
    var body = JSON.stringify(data);
    httpRequest(options, callback, body);
};

/**
 * HTTP PUT Request
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {String} path - path to request the ACS endpoint
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account clientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 *  */
module.exports.PUT = function (token, path, callback) {
    var options = {
        host: host,
        port: 443,
        path: baseUrl + path,
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'x-header-token': token            
        }
    };
    httpRequest(options, callback);
};

/**
 * HTTP DELETE Request
 * @param {Object} xapi - API credentials
 * @param {String} xapi.vpcUrl - ACS server to request
 * @param {String} xapi.ownerId - ACS ownerId
 * @param {String} xapi.accessToken - ACS accessToken
 * @param {String} path - path to request the ACS endpoint
 * @param {Object} devAccount - information about the Aerohive developper account to user
 * @param {String} devAccount.clientID - Aerohive Developper Account clientID
 * @param {String} devAccount.clientSecret - Aerohive Developper Account secret
 * @param {String} devAccount.redirectUrl - Aerohive Developper Account redirectUrl
 *  */
module.exports.DELETE = function (token, path, callback) {
    var options = {
        host: host,
        port: 443,
        path: baseUrl + path,
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'x-header-token': token            
        }
    };
    httpRequest(options, callback);
};

function httpRequest(options, callback, body) {
    var result = {};
    result.request = {};
    result.result = {};


    result.request.options = options;
    var req = https.request(options, function (res) {
        result.result.status = res.statusCode;
        console.info('STATUS: ' + result.result.status);
        result.result.headers = JSON.stringify(res.headers);
        console.info('HEADERS: ' + result.result.headers);
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var request = result.request;
            if (body) request.body = JSON.parse(body);
            else request.body = {};
            if (data != '') {
                var dataJSON = JSON.parse(data);
                result.data = dataJSON.data;
                result.error = dataJSON.error;
            }
            request.options.headers['X-AH-API-CLIENT-SECRET'] = "anonymized-data";
            switch (result.result.status) {
                case 200:
                    callback(null, result.data, request);
                    break;
                default:
                    var error = {};
                    console.error(result);
                    callback(result.error, result.data, request);
                    break;

            }
        });
    });
    req.on('error', function (err) {
        console.log(err);
        callback(err, null);
    });


    // write data to request body
    req.write(body + '\n');
    req.end();


}