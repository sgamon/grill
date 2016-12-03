'use strict';

var moment = require('moment-timezone');

/**
 * Return day boundary timestamps in UTC.
 *
 * The boundary starts at the beginning of the indicated {day}, and ends
 * at the end of the indicated {day}. Boundary timestamps are returned in
 * UTC time.
 *
 * @param {string }day Day (YYYY-MM-DD), or full ISO8601 string (YYYY-MM-DDTHH:MM:SS.000Z)
 * @param {string} tz IANA timezone. ie, "America/New_York"
 * @returns {{day: *, tz: *, tzYear: *, tzMonth: *, tzDay: *, tzTime: *, utcStart: *, utcEnd: *}}
 */
module.exports = function(day, tz) {
  var tzYear = moment.tz(day, tz).year();
  var tzMonth = moment.tz(day, tz).month() + 1;
  var tzDay = moment.tz(day, tz).date();
  var tzTime = moment.tz(day, tz).format('HH:mm:ss');
  var utcStart = moment.tz(day, tz).startOf("day").tz('UTC');
  var utcEnd = moment.tz(day, tz).endOf("day").tz('UTC');

  return {
    day: day,
    tz: tz,
    tzYear: tzYear,
    tzMonth: tzMonth,
    tzDay: tzDay,
    tzTime: tzTime,
    utcStart: utcStart.format(),
    utcEnd: utcEnd.format()
  };

};
