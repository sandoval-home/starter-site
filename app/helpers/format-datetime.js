import Ember from 'ember';

/**
 * Handlebars helper for displaying formatted dates and times
 *
 * Refer to http://momentjs.com/docs/ for format documentation
 *
 * @param {Moment} date/time value
 * @param {string} Token date/time format
 */
export function formatDatetime(params/*, hash*/) {
    let datetime = params[0],
        format = params[1],
        formattedDatetime;

    // If a value param was passed
    if (datetime) {
        // If the value param is a Moment object and a string format was passed
        if (datetime instanceof moment && format && typeof format === 'string') {
            // Set return value to formatted string
            formattedDatetime = datetime.format(format);
        } else {
            // Otherwise just return the input value
            formattedDatetime = datetime;
        }
    } else {
        // Otherwise return a template-safe null
        formattedDatetime = '';
    }

    return formattedDatetime;
}

export default Ember.Helper.helper(formatDatetime);
