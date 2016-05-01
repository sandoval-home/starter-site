import Ember from 'ember';
import ApplicationComponent from 'app/components/application-component';

/**
 * UI over table container class
 *
 * @param {Object} tableConfig
 * @param {Array}  data
 */

export default ApplicationComponent.extend({

    // Ember hook for setting the component container tag type
    tagName: 'div',

    // Ember hook for setting the container CSS class names
    classNames: ['table-component'],

    // Shortcut to the table field configuration
    //fields: Ember.computed.oneWay('tableConfig.fields'),

    fields: Ember.computed.map('tableConfig.fields', function (field) {
        var sort = (this.get('tableConfig.sort')) ? this.get('tableConfig.sort')[0] : null,
            isSortedAsc = (sort === field.get('modelProperty')),
            isSortedDesc = (sort === field.get('modelProperty') + ':desc');

        field.set('isSortedAsc', isSortedAsc);
        field.set('isSortedDesc', isSortedDesc);

        return field;
    }),

    // Shortcut to the table column width definition
    colWidths: Ember.computed.mapBy('fields', 'colWidthCSSClass'),

    /**
     * Observe the table data and the filter string and set the
     * array of filtered record on the component
     */
    setFilteredData: function () {
        var data = this.get('data'),
            filterText = this.get('filterText'),
            filteredData,
            component = this;

        // If a filter string exists
        if (filterText) {
            // @TODO Implement filtering
        } else {
            // Otherwise return the full dataset
            filteredData = data;
        }

        // Set the value on the component
        component.set('filteredData', filteredData);

    }.observes('data.@each', 'filterText').on('init'),

    // Default sort configuration
    //
    // For literal values you can return an array of strings that are
    // the property names and even use property:asc, property:desc, multiple compound
    // properties, etc. For Objects you may use nested literals. For Objects that
    // have no nested literals (like Moments) you would have to pass a custom
    // sort function (see http://emberjs.com/api/classes/Ember.computed.html#method_sort)
    _defaultSortConfig: [''],

    /**
     * Proxy the sort configuration to a property that will be used by the
     * computed data array.
     *
     * @return {Array|Function} sortConfig
     */
    sortConfig: function () {
        var sort = this.get('tableConfig.sort'),
            sortConfig;

        // If a valid sortConfig was passed then use that
        if (sort) {
            sortConfig = sort;
        } else {
            // Otherwise fall back to the default config
            sortConfig = this.get('_defaultSortConfig');
        }

        return sortConfig;

    }.property('tableConfig.sort'),

    /**
     * Maintain a sorted version of the filtered data.
     * This is the yield/return of this component to its caller.
     */
    sortedAndFiltered: Ember.computed.sort('filteredData', 'sortConfig'),

    /**
     * Ember Component actions
     */
    actions: {
        /**
         * Update the tableConfig.sort
         *
         * @param {Object} fieldDef
         */
        tableSort: function (fieldDef) {
            var currentSort = this.get('tableConfig.sort'),
                fieldType = fieldDef.get('displayType'),
                fieldName = fieldDef.get('modelProperty');

            // Unset all the field sort directions
            this.get('fields').forEach(function (field) {
                field.set('isSortedAsc', false);
                field.set('isSortedDesc', false);
            });

            // After a looong time trying to get Ember.computed.sort to respect a
            // function sort config (dynamically) we just landed here for now.
            // @TODO
            if (fieldType === 'date') {
                fieldName += '._i';
            }

            // If there is no current sort or the current sort is different
            if (!currentSort || currentSort[0] !== fieldName) {
                // Update the sort property ascending
                this.get('tableConfig').set('sort', [fieldName]);
                fieldDef.set('isSortedAsc', true);
            } else if (currentSort[0] === fieldName) {
                // Otherwise update the sort property descending
                this.get('tableConfig').set('sort', [fieldName + ':desc']);
                fieldDef.set('isSortedDesc', true);
            }
        }
    }

});
