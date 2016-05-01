import Ember from 'ember';

/**
 * Table cell data definition utility class.
 *
 * Helps close the gap on several fronts between a table row (with a model record
 * and field definition array) and child table cells (who really just want a
 * synchronous value to work with). This object will contain a computed property
 * to the model field value/relationship and also resolve the relationship if needed.
 *
 * Ultimately the 'cellValue' property can be observed or passed from row to cell components.
 * Otherwise the entire object could be passed to the cell component if it needs to
 * do some trickier handling.
 *
 * @param {Object} record
 * @param {string} displayProperty
 * @param {string} displayType
 * @param {string} displayFormat
 */

export default Ember.Object.extend({

    /**
     * Ember hook for object initialization
     */
    init: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Dynamically create a computed property that resolves the record field
        Ember.defineProperty(this, 'recordValue', Ember.computed.oneWay('record.' + this.get('displayProperty')));

        // Initialize the cell raw value
        this.setCellValue();
    },

    /**
     * Observe the recordValue property and proxy it to the cellValue
     * property for both synchronous and asynchronous values
     */
    setCellValue: function () {
        var recordValue = this.get('recordValue'),
            cell = this;

        // If the record value is async (such as a model relationship)
        if (recordValue && Ember.canInvoke(recordValue, 'then')) {
            recordValue.then(function (resolved) {
                if (resolved && Ember.canInvoke(resolved, 'get')) {
                    // @TODO: Set the resolved value on the cell object
                    cell.set('cellValue', resolved.get('name'));
                }
            });
        } else {
            // Otherwise set the value on the cell object
            cell.set('cellValue', recordValue);
        }

    }.observes('recordValue')

});
