import Ember from 'ember';
import ColumnDef from 'app/components/tables/utilities/table-column-definition';

export default Ember.Controller.extend({

    // First sample table configuration
    table1Config: Ember.Object.create({
        sort: ['location'],
        fields: Ember.A([
            ColumnDef.create({
                modelProperty: 'date',
                label: 'Date',
                description: 'Date...',
                displayType: 'date',
                displayFormat: 'M/D/YYYY',
                colWidth: '25%'
            }),
            ColumnDef.create({
                modelProperty: 'type',
                label: 'Type',
                description: 'Type...',
                colWidth: '25%'
            }),
            ColumnDef.create({
                modelProperty: 'location',
                label: 'Location',
                description: 'Location...',
            }),
            ColumnDef.create({
                modelProperty: 'count',
                label: 'Amount',
                description: 'Amount...',
                displayType: 'number',
                displayFormat: '$0,0.00',
                colWidth: '25%'
            })
        ])
    }),

    /**
     * Template bound CSS class of the save button row
     * @return {string} saveRowClass
     */
    saveRowClass: function () {
        var isRowHighlighted = this.get('isSaveRowHighlighted'),
            saveRowClass = (isRowHighlighted) ? 'save-button-row-hightlight' : 'save-button-row';

        return saveRowClass;

    }.property('isSaveRowHighlighted'),

    /**
     * Template bound action label of the save button row
     * @return {string} saveRowClass
     */
    saveRowActionName: function () {
        var isRowHighlighted = this.get('isSaveRowHighlighted'),
            saveRowActionName = (isRowHighlighted) ? 'Remove' : 'Add';

        return saveRowActionName;

    }.property('isSaveRowHighlighted'),

    /**
     * Template bound CSS class of the cancel button row
     * @return {string} cancelRowClass
     */
    cancelRowClass: function () {
        var isRowHighlighted = this.get('isCancelRowHighlighted'),
            cancelRowClass = (isRowHighlighted) ? 'cancel-button-row-hightlight' : 'cancel-button-row';

        return cancelRowClass;

    }.property('isCancelRowHighlighted'),

    /**
     * Template bound action label of the cancel button row
     * @return {string} cancelRowClass
     */
    cancelRowActionName: function () {
        var isRowHighlighted = this.get('isCancelRowHighlighted'),
            cancelRowActionName = (isRowHighlighted) ? 'Remove' : 'Add';

        return cancelRowActionName;

    }.property('isCancelRowHighlighted'),

    /**
     * Template bound CSS class of the delete button row
     * @return {string} deleteRowClass
     */
    deleteRowClass: function () {
        var isRowHighlighted = this.get('isDeleteRowHighlighted'),
            deleteRowClass = (isRowHighlighted) ? 'delete-button-row-hightlight' : 'delete-button-row';

        return deleteRowClass;

    }.property('isDeleteRowHighlighted'),

    /**
     * Template bound action label of the delete button row
     * @return {string} deleteRowClass
     */
    deleteRowActionName: function () {
        var isRowHighlighted = this.get('isDeleteRowHighlighted'),
            deleteRowActionName = (isRowHighlighted) ? 'Remove' : 'Add';

        return deleteRowActionName;

    }.property('isDeleteRowHighlighted'),

    // Button row highlight/background state
    isSaveRowHighlighted: false,
    isCancelRowHighlighted: false,
    isDeleteRowHighlighted: false,

    /**
     * Computed label of the table 1 data toggle state
     * @return {string} table1DataAction
     */
    table1DataAction: function () {
        var mockDataset = this.get('mockDataset'),
            table1DataAction = (mockDataset === 'set1') ? 'Update' : 'Restore';

        return table1DataAction;

    }.property('mockDataset'),

    /**
     * Ember Controller actions
     */
    actions: {
        /**
         * Toggle state on the button row backgrounds
         */
        updateRowBackground: function (row) {
            this.toggleProperty('is' + row.capitalize() + 'RowHighlighted');
        }
    }

});
