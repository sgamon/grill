'use strict';

var Promise = require('bluebird');
var log = require('./logger')('bbq-errors.json');

/*
 * Parses an http response from the external (npm) 'request' library.
 * Returns a rejected Promise if HTTP Status Code is not 2xx.
 * Returns a rejected Promise if response body begins with '<!doctype html>'.
 * Returns the response body if the content-type header is 'text/plain'.
 * Otherwise, returns the result of JSON.parse() on the response body.
 */
function parse(response)
{
	var body = response && response[0]? response[0].body || '' : '';
	var code = response && response[0]? response[0].statusCode || 500 : 500;
	
	if (/^<!doctype html>/.test(body))
		return Promise.reject({ code: 500, message: 'response was HTML' });

	if (code < 200 || code >= 300)
		return Promise.reject({ code: code, message: body });
	
	if (response[0].headers['content-type'] == 'text/plain')
		return body;
	
	return JSON.parse(body);
}

/*
 * Sends a plain text error to the client, if a response object is provided.
 * The given 'err' may be a string or an object with a 'message' property,
 * such as the first argument passed to a promisified failure callback.
 * Throws the provided message and code if no response object provided.
 * Returns nothing.
 */
function sendError(request, response, err, code)
{
	var code = code || err.code || 500;
	var msg = err? err.message || err.toString() : 'An unknown exception occurred';
	
	if (isNaN(code))
	{
		code = code == 'ER_DUP_ENTRY'? 409 : 500;
		
		if (code == 409 && err.keyType && err.keyValue)
			msg = 'The ' + err.keyType + ' "' + err.keyValue + '" already exists.';
	}

	if (!response)
		throw { code: code, message: msg };

	response.type('text/plain').send(code, msg);

	if (err && !err.logged && code >= 500)
		log.error({ 'req': request, 'res': response, 'err': err || msg });
}

/*
 * Inspects the given mysql_result for an 'insertedId' member and
 * sends it to the client if a response object was provided.
 * The 'insertedId' member is provided by the external (npm) 'mysql'
 * library after a successful insert operation.
 * Returns the insertedId provided, or 0.
 */
function sendNewId(response, mysql_result)
{
	var id = mysql_result? mysql_result.insertId || 0 : 0;

	if (response)
		response.type('text/plain').send(200, id.toString());
	
	return id;
}

/*
 * Sends the given text argument as a text/plain response to the client
 * if a response object is provided.  The string sent to the client and/or
 * returned is the result of calling text.toString()
 */
function sendText(response, text)
{
	text = text? text.toString() : '';

	if (response)
		response.type('text/plain').send(200, text);
	
	return text;
}

/*
 * Sends an object to the client as JSON, if a response object is provided.
 * If an object is not provided, an HTTP 404 is sent to the client.
 * The object may be an array (but [] does not elicit an HTTP 404 response).
 * The given type and id are only used to construct an HTTP 404 message.
 * Returns the object provided.
 */
function sendObject(response, obj, type, id)
{
	if (response)
		if (obj)
			response.json(obj);
		else
			throw { code: 404, message: type + (id? ' ' + id : '') + ' not found' };
	
	return obj;
}


//
// public interface
//

exports.parse = parse;
exports.sendError = sendError;
exports.sendNewId = sendNewId;
exports.sendText = sendText;
exports.sendObject = sendObject;
