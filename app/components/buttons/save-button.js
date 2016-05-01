import Button from 'app/components/buttons/_button';

/**
 * UI save button component
 *
 * Template properties specific to this component:
 *
 * @param {string} [classNames]
 * @param {string} [icon]
 * @param {string} [text]
 */

export default Button.extend({

    // Ember hook for setting the container CSS class names
    classNames: ['btn-primary'],

    // Default display text of the button element
    defaultDisplayText: 'Save',

    // @TODO
    click: function () {
        console.log('save');
    }
});
