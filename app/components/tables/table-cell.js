import ApplicationComponent from 'app/components/application-component';

/**
 * UI table cell component class
 *
 * Template properties specific to this component:
 *
 * @param {*}      cellValue
 * @param {string} [displayType]
 * @param {string} [displayFormat]
 */

export default ApplicationComponent.extend({

    // Ember hook for setting the component container tag type
    tagName: 'td',

    // Ember hook for setting the container CSS class names
    classNames: ['table-cell'],

    /**
     * Computed boolean that tells the template to render a datetime formatter
     *
     * @return {Boolean}
     */
    isDatetime: function () {
        return (this.get('displayType') === 'date');
    }.property('displayType'),

    /**
     * Computed boolean that tells the template to render a number formatter
     *
     * @return {Boolean}
     */
    isNumber: function () {
        return (this.get('displayType') === 'number');
    }.property('displayType'),

});
