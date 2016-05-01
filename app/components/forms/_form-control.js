import ApplicationComponent from 'app/components/application-component';
import FormValidationOnChange from 'app/mixins/form-validation-onchange';

/**
 * This is the top-level class for form components. This class contains
 * generic form control properties that can be applied or overridden by
 * extended sub-classes.
 *
 * An Ember mixin of model utilities is included aid in establishing model
 * conventions and retrieval of model metadata. A mixins is also used to capture
 * the value change event and make a call to the triggerValidation() method
 * under certain circumstances.
 *
 * Component-level validation can be toggled on/off with the componentValidation
 * property. A component isValid state is updated to represent validation status.
 *
 * Template components should not call this class directly.
 *
 * The following properties are designed to be used or overridden by the templates:
 *
 * @param {string}  value
 * @param {string}  [label]
 * @param {Boolean} [showLabel]
 * @param {string}  [placeholder]
 * @param {string}  [description]
 * @param {string}  [faInputIcon]
 * @param {string}  [faInfoIcon]
 * @param {string}  [faAlertIcon]
 * @param {Boolean} [required]
 * @param {Boolean} [autoFocus]
 *
 * @TODO
 * @param {Number}  [tabindex]
 *
 * @param {Boolean} [readOnly]
 * @param {Boolean} [componentInfo]
 * @param {Boolean} [componentValidation]
 * @param {string}  [customValidationMessage]
 * @param {Boolean} [shouldValidateOnLoad]
 * @param {Boolean} [shouldValidateOnConstraintChange]
 *
 * @param {string}  [modelCommonName]
 * @param {string}  [usageType]
 * @param {string}  [elementID]

 *
 */

export default ApplicationComponent.extend(FormValidationOnChange, {
    /**
     * Form component display label. Even if the showLabel property is set to false
     * a label should still be defined by child instances for descriptive purposes
     *
     * @default ''
     */
    label: '',

    /**
     * Toggles the label visibility for the form component. Even if this property
     * is set to false a label value should still be defined for descriptive purposes
     *
     * @default false
     */
    showLabel: null,

    /**
     * Placeholder text that will be displayed on the form element (if the element allows).
     * This text may be augmented by the displayPlaceholder() method that is bound to
     * the component templates.
     *
     * The placeholder value is dynamically set based on the modelCommonName, unless
     * explicitly passed in.
     *
     * @default null
     */
    placeholder: null,

    /**
     * Informational text about the field that will be displayed if componentInfo
     * is set to true.
     *
     * The description value is dynamically set based on the modelCommonName, unless
     * explicitly passed in.
     *
     * @default ''
     */
    description: '',

    /**
     * This is a font-awesome icon class that will be used by within the component input
     * to visually represent the type of input
     *
     * @default ''
     */
    faInputIcon: '',

    /**
     * This is a font-awesome icon class that will be used by the component to
     * suggest more information to the user, such as a hover message
     *
     * @default 'fa-info-circle'
     */
    faInfoIcon: 'fa-info-circle',

    /**
     * This is a font-awesome icon class that will be used by the component to
     * notify the user of alerts, such as validation failures
     *
     * @default 'fa-exclamation-circle'
     */
    faAlertIcon: 'fa-exclamation-circle',

    /**
     * This is a boolean value that describes whether the component form field
     * is required.
     *
     * @default false
     */
    required: false,

    /**
     * This is a boolean value that describes whether the component form field
     * should receive focus on page load
     *
     * @default false
     */
    autoFocus: false,

    /**
     * This is a boolean value that describes whether the component form field
     * should be readonly, not allowing users to enter manual values. A use case
     * for this property may be when you only want the user to select values from
     * a prescribed selector.
     *
     * @default null
     */
    readOnly: null,

    /**
     * This is a boolean value that describes whether the component should
     * offer more extended general information to the user, such as informational
     * text on icon hover
     *
     * @default true
     */
    componentInfo: true,

    /**
     * This is a boolean value that describes whether the component should
     * run its own validations - provided via Mixin in the type-specific
     * child classes
     *
     * @default true
     */
    componentValidation: true,

    /**
     * This is a string value that overrides the built-in component validation
     * alert message with a custom message.
     *
     * @default ''
     */
    customValidationMessage: '',

    /**
     * A boolean value that specifies whether the form control should validate
     * immediately after render
     */
    shouldValidateOnLoad: true,

    /**
     * This is a boolean value that notes whether or not the component should
     * trigger validation when its constraints change (minLength, minDate, etc.).
     * No action is taken in this parent class. Type-specific child classes can
     * observe specific properties and handle changes as needed.
     *
     * @default false
     */
    shouldValidateOnConstraintChange: false,



    /**
     * The part of the model name that is common to all the objects and variables
     * associated with a particular field. This string segment is used to derive
     * all of the associated lookups, metadata, etc.
     *
     * @default ''
     */
    modelCommonName: '',

    /**
     * This is a field usage type from the CMS that describes whether a form field
     * requires a value and also whether the field allows 'NOT' values
     *
     * @default ''
     */
    usageType: '',

    /**
     * Ember object initialization method
     */
    init: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Initialize validation settings and properties
        this.initializeValidationProperties();
    },

    /**
     * Custom hook that will run in a scheduled run loop from an Ember render
     * hook in /components/nfors.js
     */
    afterRender: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Check for component input autofocus
        this.setAutoFocus();

        // Adjust component settings if within an HTML table
        this.lookForParentTable();

        // If the component has a help message then handle display edge cases
        // by adjusting the size or position of the help message
        this.adjustHelpMessageDisplay();

        // Set the initial help message text
        this.setInitialHelpMessage();

        // Initialize help message interactions
        this.initializeHelpMessage();

        // Initialize observers for the show-hide mode
        this.initializeShowHideObservers();

        // Trigger validation on DOM insertion
        if (this.get('shouldValidateOnLoad')) {
            this.triggerValidation();
        }

        // Observe the required flag and run the validation routine when it changes
        this.addObserver('required', this, this.triggerValidation);
    },

    /**
     * Ember hook for catching the imminent removal of an element from the DOM
     */
    willDestroyElement: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Remove the help message event listeners
        this.destroyHelpMessage();

        // Remove the show-hide toggle event listeners
        this.destroyShowHideObservers();

        // Unobserve the required flag that triggers validation
        this.removeObserver('required', this, this.triggerValidation);
    },

    /**
     * Update component validation settings based on parameters. If the component
     * validation is disabled all together then set the valid state to true. Otherwise,
     * look to see if the model has provided any of its own validations.
     */
    initializeValidationProperties: function () {
        // If componentValidation is disabled
        if (!this.get('componentValidation')) {
            // Set component isValid state to true
            this.set('isValid', true);
        } else {
            // Otherwise look for model-supplied validations
            //
            // @TODO
            //this.set('modelValidations', this.getModelValidations());
        }
    },

    /**
     * Set up event listeners and DOM updates to support the interactivity
     * and display of component help messages
     */
    initializeHelpMessage: function () {
        // If componentInfo is enabled
        if (this.get('componentInfo')) {
            // Bind a listener to the help icon hover-type event to display help messages
            this.$().on('mouseenter mouseleave touchstart', '.help-icon .fa', {scope: this}, this.helpIconToggleMessage);
        } else if (this.get('componentValidation')) {
            // Otherwise update the component layout and only allow hover messeges for validation alerts
            this.$().addClass('overlay-help');
            this.$().on('mouseenter mouseleave click touchstart', {scope: this}, this.validationOnlyToggleMessage);
        }
    },

    /**
     * Tear down the event bindings from help message initialization
     */
    destroyHelpMessage: function () {
        // Remove the listener to the hover-type event of the help/alert icon
        this.$('.help-icon .fa').off('mouseenter mouseleave touchstart', this.helpIconToggleMessage);
        // Remove the listener to the hover-type event of the form control for validation-only messages
        this.$().off('mouseenter mouseleave click touchstart', this.validationOnlyToggleMessage);
    },

    /**
     * Set up event listeners to support show-hide toggle selections during show-hide mode
     */
    initializeShowHideObservers: function () {
        this.$().on('click', '.show-hide-edit .show-field span', {scope: this, action: 'show'}, this.adminShowHideToggle);
        this.$().on('click', '.show-hide-edit .hide-field span', {scope: this, action: 'hide'}, this.adminShowHideToggle);
    },

    /**
     * Tear down event listeners to support show-hide toggle selections during show-hide mode
     */
    destroyShowHideObservers: function () {
        this.$().off('click', '.show-hide-edit .show-field span', this.adminShowHideToggle);
        this.$().off('click', '.show-hide-edit .hide-field span', this.adminShowHideToggle);
    },

    /**
     * Handle autofocus settings. This may be overridden by other components on the page.
     */
    setAutoFocus: function () {
        // If the autoFocus option is true
        if (this.get('autoFocus')) {
          this.$().find(':input').filter(':visible:first').focus();
          // @TODO: Add autofocus support for checkbox groups
        }
    },

    /**
     * Computed property that determines the display label for dynamic messages.
     * If no label was passed from the template then a generic alternative is computed.
     *
     * @return {string} displayLabel
     */
    displayLabel: function () {
        var displayLabel;

        if (this.get('label')) {
            // Use the label value if it was passed
            displayLabel = this.get('label');
        } else if (this.get('placeholder')) {
            // Otherwise use the placeholder if it was passed
            displayLabel = this.get('placeholder');
        } else {
            // Otherwise use a generic description based on the data type
            displayLabel = this.get('dataType') + ' value ';
        }

        return displayLabel;

    }.property('label'),

    /**
     * Computed property that determines the complete placeholder text
     *
     * @return {string} displayPlaceholder
     */
    displayPlaceholder: function () {
        var displayPlaceholder;

        // Set the default value to any explicitly passed value (unless we are in edit mode)
        displayPlaceholder = (this.showHideAdmin.get('isNotEditMode')) ? this.get('placeholder') : '';

        // If placeholder value is falsy (and not explicitly set to blank)
        if (!displayPlaceholder && displayPlaceholder !== '') {
            // See if the controller model metadata element name exists
            if (this.get('controllerModelMeta.elementName')) {
                displayPlaceholder = this.get('controllerModelMeta.elementName');
            } else if (this.get('label')) {
                // Otherwise use the component label
                displayPlaceholder = this.get('label');
            } else {
                // Otherwise blank
                displayPlaceholder = '';
            }
        }

        // If the component value is required then add notation to the placeholder text
        if (this.get('required') && !this.get('notValueDisplay')) {
            displayPlaceholder += '*';
        }

        return displayPlaceholder;

    }.property('placeholder', 'required'),

    /**
     * Computed property that determines the component description text
     *
     * @return {string} displayDescription
     */
    displayDescription: function () {
        var displayDescription;

        // Set the default value to any explicitly passed value
        displayDescription = this.get('description');

        // If the description value is falsy
        if (!displayDescription) {
            // See if the controller model metadata description exists
            if (this.get('controllerModelMeta.description')) {
                displayDescription = this.get('controllerModelMeta.description');
            } else {
                // Otherwise fall back to the label value
                displayDescription = this.get('displayLabel');
            }
        }

        return displayDescription;

    }.property('description'),

    /**
     * Computed property that determines the component usageType
     *
     * @return {string} usageType
     */
    internalUsageType: function () {
        var usageType;

        // Set the default value to any explicitly passed value
        usageType = this.get('usageType');

        // If the usageType value is falsy
        if (!usageType) {
            // See if the controller model metadata usageType exists
            if (this.get('controllerModelMeta.usageType')) {
                usageType = this.get('controllerModelMeta.usageType');
            } else {
                usageType = null;
            }
        }

        return usageType;

    }.property('usageType'),

    /**
     * Ember hook for catching focus event of the component
     */
    focusIn: function() {
        // Update the focused property
        this.set('focused', true);
    },

    /**
     * Ember hook for catching blur event of the component
     */
    focusOut: function() {
        // Update the focused property
        this.set('focused', false);
    },

    // Mutable input element type that may be bound in the template
    // Child classes should define this (text, email, password, select, textarea, etc)
    inputType: '',

    // Mutable data type that will be used for validation
    // Child classes should define this
    dataType: '',

    // Class names applied to the component regardless of what was added by the controller template
    // Child class definitions will add to this list
    classNames: ['form-control', 'clearfix'],

    // Dynamic CSS classes applied based on component properties
    classNameBindings: ['normalModeAdminHide', 'remove'],

    // CSS-class-name-bound property that describes whether an admin has hidden this field
    normalModeAdminHide: false,

    // CSS-class-name-bound property that describes whether the component should be removed from the page
    remove: false,

    // Mutable focus state of the form component
    focused: false,

    // Mutable status message string that is returned to the hover alert helper
    statusMessage: '',

    // Mutable validation status of the form component
    isValid: null,

    // Tracks whether validation has failed at least once
    // This can be used to change the way users are presented with feedback
    hasFailed: null,

    /**
     * Top-level validation routines for the form components. When this method
     * is called from a sub-class instance the scope should also be passed so that
     * these validation actions take place on the properties of the calling object
     *
     * This top-level class simply checks for a required value.
     *
     * @param {string} value
     */
    componentValidate: function (value) {
        var usageType = this.get('internalUsageType'),
            notValue = this.get('notValue');

        // If modelValidation service has enabled the debugging allFieldsRequired flag
        if (this.modelValidation.get('allFieldsRequired')) {
            // Run adjusted field validation
            if (usageType === 'Mandatory' && !value && typeof value !== 'number') {
                this.set('statusMessage', this.get('displayLabel') + ' is required');
                this.set('isValid', false);
            } else if ((usageType === 'Required' || this.get('required')) && !value && typeof value !== 'number' && !notValue) {
                this.set('statusMessage', this.get('displayLabel') + ' is required');
                this.set('isValid', false);
            } else {
                // All validations at this level have passed
                this.set('statusMessage', '');
                this.set('isValid', true);
            }
        } else {
            // Otherwise run normal validation
            if (usageType === 'Mandatory' && !value && typeof value !== 'number') {
                this.set('statusMessage', this.get('displayLabel') + ' is required');
                this.set('isValid', false);
            } else if (usageType === 'Required' && !value && typeof value !== 'number' && !notValue) {
                this.set('statusMessage', this.get('displayLabel') + ' is required');
                this.set('isValid', false);
            } else {
                // All validations at this level have passed
                this.set('statusMessage', '');
                this.set('isValid', true);
            }
        }
    },

    /**
     * A utility method that should be used by events to trigger component input validation
     */
    triggerValidation: function () {
        var validationValue;

        // If component-level validation is enabled then execute the validation routines
        if (this.get('componentValidation') && this.showHideAdmin.get('isNotEditMode')) {
            // Set the value to be validated
            validationValue = (this.get('customValue')) ? this.get('customValue') : this.get('value');
            // Call the component validation method
            this.componentValidate(validationValue);
        }
    },

    /**
     * Observe the validation status and update the hasFailed property
     * The hasFailed property is a one-way property that, once set, should
     * not ever be reset for the life of the object
     */
    trackFailures: function () {

        if (this.get('isValid') === false) {
            this.set('hasFailed', true);
        }
    }.observes('isValid'),

    /**
     * Respond to selections during the admin show-hide edit mode
     *
     * @param {Object} event
     */
    adminShowHideToggle: function (event) {
        var component = event.data.scope,
            action = event.data.action,
            identifier = component.get('controllerModelMeta.identifier');

        // Notify the admin show-hide service of the update
        component.showHideAdmin.waitForReady().then(function () {
            if (action === 'show' && !component.get('adminShow')) {
                component.showHideAdmin.showField(identifier);
                // Update component state
                component.set('adminShow', true);
                component.set('adminHide', false);
            } else if (action === 'hide' && !component.get('adminHide')) {
                component.showHideAdmin.hideField(identifier);
                // Update component state
                component.set('adminShow', false);
                component.set('adminHide', true);
            }
        });
    },

    /**
     * Watch the component show/hide settings. If the component/field should be hidden
     * then hide it. Otherwise it can be ghosted and still included in the layout.
     *
     * If a field is set to be hidden there is an extra check to see if the field is
     * Mandatory. If a CMS update changes a usageType to Mandatory, but the field has
     * already been hidden by the admins then an attempt to re-show the field is made.
     */
    hideInNormalMode: function () {
        var adminHide = this.get('adminHide'),
            component = this;

        // If we are not in show-hide edit mode and the field is set to hidden
        if (this.showHideAdmin.get('isNotEditMode') && adminHide) {

            // If the field is Mandatory then there was likely a CMS update that has
            // resulted in an admin-hidden field having its usageType changed to Mandatory.
            if (this.get('isMandatory')) {
                // Attempt to update/repair the show-hide field setting
                this.adminShowHideToggle({ data: { scope: this, action: 'show' }});
            } else {
                // Otherwise set the component template class binding to hide the field
                this.set('normalModeAdminHide', true);

                // Remove form inputs from the tab index
                this.$(':input').each(function () {
                    component.$(this).attr('tabindex', -1);
                });

                // If the administrator has decided to ghost hidden fields in the layout
                if (this.showHideAdmin.get('shouldGhostHiddenFields')) {
                    // Add/enable overlay masks that disbale UI interaction with the form control
                    this.$('.form-control-input').prepend('<div class="disabled-mask"></div>');
                    this.$('.list-mask').addClass('visible');

                    // Unset some properties that limit UI interactivity
                    if (!this.get('displayPlaceholder').match(/^(Not Applicable|Not Reporting)$/)) {
                        this.set('placeholder', '');
                    }
                    this.set('componentInfo', false);
                    this.set('allowNotValues', false);
                } else {
                    // Otherwise remove the field from the layout (will display: none)
                    this.set('remove', true);
                }

                // Turn off compoment validation
                this.set('componentValidation', false);
                if (!this.get('isValid')) {
                    this.set('isValid', true);
                }
            }
        }

    }.observes('adminHide'),

    /**
     * Monitor the isValid value and toggle the invalid CSS class
     * on the component view element
     */
    toggleStatusCSS: function () {

        this.$().toggleClass('invalid', !this.get('isValid'));

    }.observes('isValid'),

    /**
     * Determine whether any of the help types are enabled for the control
     * (validation alerts, field info). If any are enabled then establish
     * this property as true, otherwise false.
     *
     * @return {Boolean}
     */
    componentHelp: function () {

        // Return whether any of the help types are enabled
        return (this.get('componentInfo') || this.get('componentValidation'));

    }.property('componentInfo', 'componentValidation'),

    /**
     * The help message text that displays component description, validation alerts, etc.
     * This method monitors the status message and overrides the display description with
     * validation error message, if needed.
     *
     * @return {string}
     */
    helpMessage: function () {
        var messageText = this.get('displayDescription');

        // If the component status is not valid (and not initial null) then update the status message
        if (!this.get('isValid') && this.get('isValid') !== null) {
            messageText = this.get('statusMessage');
        }

        return messageText;

    }.property('statusMessage'),

    /**
     * Toggle the visibility of the help message on browser event (hover, touch, etc.)
     *
     * @param {Object} event
     */
    helpIconToggleMessage: function (event) {
        var _this = event.data.scope;

        // Toggle the hidden class on the help message
        _this.$('.help-message').toggleClass('hidden', 0).promise().done(function () {
            // Because the help message needs a very high z-index, the overlap of the
            // help icon causes mouseenter/mouseleave issues. Therefore, the help icon
            // must receive a higher z-index while the help message is visible
            if (_this.$('.help-message').is(':visible')) {
                _this.$('.help-icon').css('z-index', '1000');
            } else {
                _this.$('.help-icon').css('z-index', 'auto');
            }
        });
    },

    /**
     * Set the initial component help message
     */
    setInitialHelpMessage: function () {
        // Set the initial help message as the component description
        this.set('statusMessage', this.get('description'));
    },

    /**
     * When componentInfo is set to false this method will allow interactive events
     * to toggle the validation help message.
     *
     * @param {Object} event
     */
    validationOnlyToggleMessage: function (event) {
        var _this = event.data.scope;

        // If the form component is invalid then handle toggling the validation help message
        if (_this.$().hasClass('invalid')) {
            if (event.type === 'mouseenter') {
                _this.$('.help-message').removeClass('hidden');
            } else if (event.type === 'mouseleave') {
                _this.$('.help-message').addClass('hidden');
            } else if (event.type === 'click' || event.type === 'touchstart') {
                if (_this.$('.help-message').is(':visible')) {
                    _this.$('.help-message').addClass('hidden');
                } else {
                    _this.$('.help-message').removeClass('hidden');
                }
            }
        } else {
            // Otherwise remove the validation help message if it is still showing
            if (_this.$('.help-message').is(':visible')) {
                _this.$('.help-message').addClass('hidden');
            }
        }
    },

    /**
     * When componentInfo is set to false this method will observe the isValid state and
     * remove the validation help message for edge cases not caught by the standard
     * toggle function
     */
    validationOnlyRemoveMessage: function () {

        // If component icons are disabled and the status is valid but the validation message is still showing
        if (!this.get('componentInfo') && this.get('isValid') && this.$('.help-message').is(':visible')) {
            // Hide the validation message
            this.$('.help-message').addClass('hidden');
        }
    }.observes('isValid'),

    /**
     * Check certain conditions regarding the size and position of the component
     * help message and make adjustments as needed.
     *
     * A few of the edge cases captured so far are when .overlay-help causes the
     * .form-control-help container to be positioned absolute, losing the outer
     * container width context for its child elements. Also when the help message
     * collides with the edge of the page, causing visibility issues on smaller devices.
     */
    adjustHelpMessageDisplay: function () {
        var fieldWidth,
            widthAdjustment,
            edgeDistance,
            helpMessageCSSRight,
            helpArrowCSSRight,
            helpMessageAdjustment,
            helpArrowAdjustment;

        // If the component has a help message element
        if (this.$('.help-message').length) {

            // Determine the help message distance from the edge of the nfors-content container
            if (this.$().closest('.nfors-content').length || this.$().closest('.modal-content').length) {
                edgeDistance = this.get('helpMessageEdgeDistance');
            } else {
                edgeDistance = 1;
            }

            // If the help message collides with the border of the page
            if (edgeDistance <= 0) {
                // Find the current position of the help message box and box arrow
                helpMessageCSSRight = parseInt(this.$('.help-message').css('right'), 10);
                helpArrowCSSRight = parseInt(this.$('.help-message .arrow').css('right'), 10);

                // Use the edgeDistance to calculate the new right positions
                helpMessageAdjustment = (helpMessageCSSRight - edgeDistance + 3);
                helpArrowAdjustment = (Math.abs(helpMessageAdjustment) + 3);

                // Adjust the position of the help message box and arrow
                this.$('.help-message').css('right', helpMessageAdjustment + 'px');
                this.$('.help-message .arrow').css('right', helpArrowAdjustment + 'px');
            }

            // If the help message is disproportional
            if (!this.get('isHelpMessageProportional')) {
                // Calculate the new width of the help message
                fieldWidth = this.$('.form-control-field').width();
                if (helpArrowAdjustment) {
                    widthAdjustment = (fieldWidth + helpArrowAdjustment);
                } else {
                    widthAdjustment = (fieldWidth + 60);
                }

                // Adjust the help message width
                this.$('.help-message').css('width', widthAdjustment + 'px');
            }
        }
    },

    /**
     * Determine if the help message is disproportionally-sized.
     * This can be caused by adjustements in the .overlay-help class that
     * require relative elements to become absolute, thus losing container
     * context for their child elements.
     *
     * @return {Boolean} isMessageProportional
     */
    isHelpMessageProportional: function () {
        var helpMessageWidth = this.$('.help-message').width(),
            helpMessageHeight = this.$('.help-message').height(),
            isMessageProportional = true;

            // If the ratio of help message box height-to-width is too large
            // (Likely due to nesting the absolute elements on .overlay-help components)
            if ((helpMessageHeight / helpMessageWidth) > 0.3) {
                isMessageProportional = false;
            }

            return isMessageProportional;

    }.property(),

    /**
     * Determine the distance of the component help message from the edge of the page
     *
     * @return {Number} messageDistance
     */
    helpMessageEdgeDistance: function () {
        var helpMessageRight,
            contentRight,
            messageDistance;

        // Get the properties to determine if the help message collides with the content container
        helpMessageRight = this.$('.help-message').toggleClass('hidden', 0).offset().left + this.$('.help-message').width();
        this.$('.help-message').toggleClass('hidden', 0);
        // If this is for standard nfors-content
        if (this.$().closest('.nfors-content').length) {
            contentRight = this.$().closest('.nfors-content').offset().left + this.$().closest('.nfors-content').width();
        } else {
            // Otherwise if this is for modal-content
            contentRight = this.$().closest('.modal-content').offset().left + this.$().closest('.modal-content').width() - 30;
        }

        // Calculate the help message distance from the page container edge
        messageDistance = Math.floor(contentRight - helpMessageRight);

        return messageDistance;

    }.property(),

    /**
     * Form components have different settings when they are within an HTML table. This
     * method looks to see if the form component is a descendent of a .table-list component
     * and updates certain component properties accordingly.
     */
    lookForParentTable: function () {
        // If the form component is a descendent of a .table-list element
        if (this.$().closest('table').length) {
            // Set a flag on the object
            this.set('insideTable', true);
            // Turn off component info
            if (!this.$().closest('.TODO').length) {
                this.set('componentInfo', false);
            }
            // If no placeholder was explicitly passed then set the placeholder to blank
            if (this.get('placeholder') === null) {
                this.set('placeholder', '');
            }
        } else {
            this.set('insideTable', false);
        }
    },

    /**
     * An overridable method that that observes the insideTable property and sets the
     * component showLabel property
     */
    setShowLabel: function () {
        var insideTable = this.get('insideTable'),
            showLabel = this.get('showLabel');

        // If the component is inside of a table and does not explicity turn on showLabel
        if (insideTable && !showLabel && !this.showHideAdmin.get('isEditMode')) {
            // Turn off showLabel
            this.set('showLabel', false);
        } else if (showLabel !== false) {
            // Otherwise turn on showLabel
            // (Unless its been explicitly turned off)
            this.set('showLabel', true);
        }

    }.observes('insideTable'),

    /**
     * Form components rely on overflow: hidden on the .form-control-input class in order
     * to dynamically adjust width while keeping the .form-control-help container positioned
     * consistently.
     *
     * For some pickers, browser bugs do not allow combining overflow-x/y in a hidden/visible
     * arrangement. So we must specify a width on .form-control-input in order to re-enable
     * overflow: visible.
     *
     * @param {Object} event
     */
    enableCSSOverflow: function (event) {
        var component,
            inputWidth = 0,
            cellWidth = 0,
            elementToUpdate;

        // Set form component context
        if (event) {
            component = (event.data) ? event.data.scope : this;
            // If method was event-invoked then restore default width and overflow
            component.$('.form-control-input').css('width', 'auto');
            component.$('.form-control-input').css('overflow', 'hidden');
        } else {
            component = this;
        }

        elementToUpdate = component.$('.form-control-input').not('.form-control-checkbox .form-control-input');

        // If the form control is in a table cell then explicitly set the width of the table cell
        //  This prevents the table from trying to auto-adjust column width during our update
        if (component.$().closest('td').length) {
            cellWidth = component.$().css('width');
            component.$().closest('td').css('width', cellWidth);
        }

        // Gather the width of the child elements in the .form-control-input container
        component.$('.form-control-input').children().each(function (index) {
            var cssPosition = component.$(this).css('position'),
                cssFloat = component.$(this).css('float'),
                cssDisplay = component.$(this).css('display'),
                inFlow = false,
                isBlock = false;

            // Determine if the element is in the document flow
            if ((cssPosition === 'relative' || cssPosition === 'static') && cssFloat === 'none' && cssDisplay !== 'none') {
                inFlow = true;
            }

            // Determine if the element is block-level
            if (cssDisplay === 'block') {
                isBlock = true;
            }

            // If we are past the first element and hit a block-level element then break out of the loop
            if (index > 0 && isBlock) {
                return false;
            }

            // If element is in the document flow then account for its width
            if (inFlow) {
                inputWidth += parseInt(component.$(this).css('width'), 10);
            }
        });

        // Set an explicit width on .form-control-input so we no longer worry about CSS overflow
        elementToUpdate.css('width', (inputWidth - 2) + 'px');

        // Allow CSS overflow on the .form-control-input container
        elementToUpdate.css('overflow', 'visible');
    }

});
