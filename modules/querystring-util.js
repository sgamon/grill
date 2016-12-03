'use strict';

var _ = require('lodash');
var moment = require('moment-timezone');

/*
 * Parses a data range from the querystring of an incoming request object.
 * 
 * Returns an object containing ISO8601 date strings:
 * 'from': the starting date, if provided, or 'invalid'
 * 'to': the ending date, if provided, or the start date, if valid, or now
 * 'som': the start of the month of the start date, if valid, or the end date
 * 
 * If the start date is not an ISO8601 date string, such as a YYYY/MM/DD date
 * or a database DateTime string, then the server's local timezone is assumed.
 * 
 * If an IANA timezone string is provided in the 'tz' parameter, then the
 * start/end dates are 12:00am/11:59:59.999pm of the day specified in the
 * 'from' parameter, if valid, or now, as seen on the clock on the wall in
 * the given timezone.
 */

function getDateRangeFrom(request)
{
	var qs = (request && request.query)? request.query : {};
	var from = moment(new Date(qs.from));
	var to = qs.to? moment(new Date(qs.to)) : from.isValid()? from : moment();
	var som = (from.isValid()? from.clone() : to.clone()).startOf('month');
	var eom = som.clone().endOf('month');
	
	if (qs.tz)
	{
		var dt = moment()
					.subtract(qs.monthsAgo || 0, 'months')
					.subtract(qs.daysAgo || 0, 'days');
		
		if (qs.from)
			dt = moment(new Date(qs.from));
		
		from = moment.tz(dt, qs.tz).startOf('day');
		to = moment.tz(dt, qs.tz).endOf('day');
		som = moment.tz(dt, qs.tz).startOf('month');
		eom = moment.tz(dt, qs.tz).endOf('month');
	}
	
	if (request && request.monthRange)
	{
		from = som;
		to = eom;
	}
	
	return {
		'from': from.toISOString(),
		'to': to.toISOString(),
		'startOfMonth': som.toISOString(),
		'endOfMonth': eom.toISOString()
	};
}

/*
 * Returns an object containing the merged properties from the
 * incoming request.body, request.params, and request.query.
 * Adds a "fromto" arg by invoking getDateRangeFrom.
 * Adds a "body" arg copied from request.body.
 */

function getArgsFrom(request)
{
	var r = request || {};
	var args = _.assign({}, r.params, r.query);
	args.body = r.body;
	args.fromto = getDateRangeFrom(r);
	return args;
}


//
// public interface
//

exports.getDateRangeFrom = getDateRangeFrom;
exports.getArgsFrom = getArgsFrom;
