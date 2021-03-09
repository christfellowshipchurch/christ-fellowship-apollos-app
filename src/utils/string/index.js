/**
 * utils/string/index.js
 *
 * Author: Caleb Panza
 * Created: Feb 10, 2021
 *
 * String utility methods to be used throughout the platform
 */

import {
  parseISO,
  format,
  isToday,
  isWithinInterval,
  addDays,
  addYears,
} from 'date-fns';

/**
 *
 * @param {string} str  | String to be transformed
 * @param {object} args |
 */
// eslint-disable-next-line import/prefer-default-export
export const transformISODates = (
  str,
  { isTodayText = 'Today', withTime = false } = {}
) => {
  if (!!str && typeof str === 'string') {
    const isoRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/gim;

    return str.replace(isoRegex, (match) => {
      try {
        const iso = parseISO(match);

        /** If the date is today, display the isTodayText */
        if (isToday(iso)) {
          return withTime ? format(iso, `'Today at' h:mm A`) : isTodayText;
        }

        /** If the date is within this week: Monday */
        if (
          isWithinInterval(iso, {
            start: new Date(),
            end: addDays(new Date(), 7),
          })
        ) {
          return withTime
            ? format(iso, `EEEE 'at' h:mm A`)
            : format(iso, 'EEEE');
        }

        /** If the date is outside of this year: Jan 1, 1996 */
        if (
          !isWithinInterval(iso, {
            start: new Date(),
            end: addYears(new Date(), 1),
          })
        ) {
          return format(iso, 'EEE f, YYYY');
        }

        /** If the date is within this year: January 1 */
        return withTime
          ? format(iso, 'MMM d [at] h:mm A')
          : format(iso, 'MMMM d');
      } catch (e) {
        console.warn('Unable to parse ISO string', { e });
      }

      return match;
    });
  }

  return str;
};
