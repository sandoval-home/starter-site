import ApplicationComponent from 'app/components/application-component';

/**
 * UI button component base class
 *
 * This component should not be used in templates. Template button
 * components should extend from this class.
 */

export default ApplicationComponent.extend({

    // Ember hook for setting the component container tag type
    tagName: 'button',

    // Ember hook for setting the container CSS class names
    classNames: ['btn'],

    // Default display text of the button element
    defaultDisplayText: '',

    /**
     * Template-bound text node of the button element. Provides
     * the ability to set default text. Child component classes
     * can use this to set a default, which will reduce the number
     * of params needed in templates.
     */
    displayText: function () {
        var text = this.get('text'),
            displayText = (text) ? text : this.get('defaultDisplayText');

        return displayText;

    }.property('text'),

    /**
     * Ember Component actions
     */
    actions: {

    }

});
