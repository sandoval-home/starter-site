import Ember from 'ember';

/**
 * Table column data definition utility class.
 *
 * Helps turn expressive input properties into computed internals that
 * are used by the table component hierarchy.
 *
 * @param {string} modelProperty
 * @param {string} label
 * @param {string} description
 * @param {string} displayType
 * @param {string} displayFormat
 * @param {string} colWidth
 */

export default Ember.Object.extend({

    /**
     * Helper property that turns expressive string percent values into
     * table <col> CSS class names found in table-component.less
     *
     * @return {string} colWidthCSSClass
     */
    colWidthCSSClass: function () {
        var colWidth = this.get('colWidth'),
            colWidthNum,
            colWidthCSSClass;

        // If the width is something we expect (string % that is <= 100 and multiple of 5)
        if (colWidth && typeof colWidth === 'string' && colWidth.match(/^[\d]{2,3}%$/)) {
            colWidthNum = Number(colWidth.slice(0, -1));
            if (colWidthNum <= 100 && colWidthNum % 5 === 0) {
                // Construct the return value to match the CSS class name
                colWidthCSSClass = 'width-' + colWidthNum + 'pct';
            }
        }

        return colWidthCSSClass;

    }.property('colWidth')

});
