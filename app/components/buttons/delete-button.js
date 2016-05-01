import Button from 'app/components/buttons/_button';

/**
 * UI delete button component
 *
 * Template properties specific to this component:
 *
 * @param {string} [classNames]
 * @param {string} [icon]
 * @param {string} [text]
 */

export default Button.extend({

    // Ember hook for setting the container CSS class names
    classNames: ['btn-alert'],

    // Default display text of the button element
    defaultDisplayText: 'Delete',

    // @TODO
    click: function () {
        console.log('delete');
    }
});
