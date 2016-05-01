import Ember from 'ember';

/**
 * Component base class that serves two purposes at this time:
 * 1) Allow common/repeated functionality to inherit down the scope chain
 * 2) Specifically and temporarily address an issue with pre-2.0 didInsertElement()
 *    patterns in a 2.0-upgraded app.
 */

export default Ember.Component.extend({

    /**
     * Custom hook that will run in a scheduled run loop from the Ember didInsertElement() hook
     */
    afterRender: function () {
        //
        // Child classes can extend this method to execute pre-2.0 didInsertElement() functionality.
        // This is a temporary fix until we can get all ~90 components updated to a computed property
        // pattern that uses the 2.0+ discrete getters/setters and lifecycle hooks.
        //
    },

    /**
     * Ember hook for execution after the parent element has been inserted
     * in the DOM.
     */
    didInsertElement: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Execute a custom afterRender hook that can be used by child classes to
        // define code that was executed under the old Ember didInsertElement() pattern.
        //
        // This is used to address a deprecation issue:
        //
        // - https://github.com/emberjs/ember.js/issues/11493
        //
        // which causes multiple (usually unintended) re-renders based on the pattern of
        // setting component properties in the render hooks:
        //
        // - https://guides.emberjs.com/v2.2.0/components/the-component-lifecycle/
        //
        // Transitioning to the Ember 2.0 idomatic approach involves moving completely
        // to computed properties with the 2.0 discrete get/set hooks; meaning this is likely
        // a temporary solution to control pre-2.0 patterns in a 2.0-upgraded app.
        Ember.run.scheduleOnce('afterRender', this, function () {
            // Post-async component stability check
            if (!this.get('isDestroyed') && !this.get('isDestroying')) {
                // Execute the custom afterRender component functionality
                this.afterRender();
            }
        });
    }

});
