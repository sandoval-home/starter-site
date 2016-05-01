import Ember from 'ember';
import ApplicationComponent from 'app/components/application-component';
import CellDef from 'app/components/tables/utilities/table-cell-definition';

/**
 * UI table row component class
 *
 * Template properties specific to this component:
 *
 * @param {Object} record
 * @param {Array}  fields
 */

export default ApplicationComponent.extend({

    // Ember hook for setting the component container tag type
    tagName: 'tr',

    // Ember hook for setting the container CSS class names
    classNames: ['table-row'],

    // Marry the field definition with the record by mapping the
    // field definition array to an array of table cell definition objects.
    cells: Ember.computed.map('fields', function (field) {
        var record = this.get('record'),
            cell = CellDef.create({
                record: record,
                displayProperty: field.get('modelProperty'),
                displayType: field.get('displayType'),
                displayFormat: field.get('displayFormat')
            });

        return cell;
    }),

});
