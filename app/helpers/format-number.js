import Ember from 'ember';

/**
 * Handlebars helper for displaying formatted dates and times.
 *
 * Refer to http://numeraljs.com/ for format documentation.
 *
 * @param {Number} Number value to be formatted
 * @param {Boolean} Optional currency indicator. Default is false.
 */
export function formatNumber(params/*, hash*/) {
    let numberVal = params[0],
        format = params[1],
        formattedNumber;

    // If a value param was passed
    if (numberVal) {
        // If the value param is numeric and a string format was passed
        if (!isNaN(parseFloat(numberVal)) && isFinite(numberVal) && format && typeof format === 'string') {
            // Set return value to formatted string
            formattedNumber = numeral(numberVal).format(format);
        } else {
            // Otherwise just return the input value
            formattedNumber = numberVal;
        }
    } else {
        // Otherwise return a template-safe null
        formattedNumber = '';
    }

    return formattedNumber;
}

export default Ember.Helper.helper(formatNumber);
