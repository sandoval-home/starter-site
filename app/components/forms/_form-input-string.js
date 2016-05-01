import FormControlComponent from 'nfors-app/components/_form-control';
import ValidationTypeCheckString from 'nfors-app/mixins/validation-type-check-string';
import FormControlNotValues from 'nfors-app/mixins/form-not-values';

/**
 * This class extends from the _form-control class and is meant to be extended to 
 * create string-type form component inputs that can be used in templates.
 *
 * Character count values are maintained for current character count as well as
 * remaining character count if a maxLength was set.
 *
 * This class includes a mixin that adds string-type validation routines. These
 * routines are used by the componentValidate() method
 *
 * This class also includes a mixin that allows the selection of prescribed not-values
 * 
 * Template components should not call this class directly
 * 
 */

export default FormControlComponent.extend(ValidationTypeCheckString, FormControlNotValues, {

    /**
     * Ember object initialization method
     */
    init: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Set validation properties on the object
        if (!this.get('ignoreModelValidation')) {
            this.setStringValidationProperties();
        }
    },

    /**
     * Ember hook for catching the insertion of the component element
     * into the DOM.
     */
    didInsertElement: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Update the character count values
        this.updateCharacterCount();
    },

    /**
     * Watch for changes to constraint properties and trigger validation if specified.
     */
    handleConstraintChanges: function () {
        // If the component should validate on constraint change
        if (this.get('shouldValidateOnConstraintChange')) {
            // Trigger component validation
            this.triggerValidation();
        }
    }.observes('minLength',
               'maxLength',
               'exactLength',
               'enforceMaxLength',
               'customRegexString'),

    /**
     * Validation initializer for the string input components. This runs any validation
     * that is baked into the component itself. This type of validation can be enabled or
     * disabled in the component. Validations passed from the controller will run in 
     * a separate method.
     *
     * This validation sequence first checks the initial input string pattern, and then 
     * continues with any specific type (format) checks and length checks
     *
     * @param {string} value 
     *
     * Calls the following methods from the validation-type-check-string Mixin:
     *  - isCorrectPattern()
     *  - isCorrectType()
     *  - isCorrectLength()
     */
    componentValidate: function (value) {
        var dataType,
            label,
            isNotValueSelected;

        // Call the parent class validations
        this._super.apply(this, arguments);

        // Determine if a prescribed not-value is selected
        isNotValueSelected = (this.get('notValueList') && this.isNotValue(value));

        // If the parent validations passed then proceed with component-specific validations
        if (value && !isNotValueSelected && this.get('isValid') !== false && this.get('inputType') !== 'select') {
            // Retrieve some basic component properties
            dataType = this.get('dataType');
            label = this.get('displayLabel');
            
            // Execute the validation pattern
            if (!this.isCorrectPattern(dataType, value)) {
                // Check the string pattern of the input 
                this.set('statusMessage', this.get('customValidationMessage') || label + this.get('patternQualifierText'));
                this.set('isValid', false);
            } else if (!this.isCorrectType(dataType, value)) {
                // Check the data type of the input string
                this.set('statusMessage', label + this.get('typeQualifierText'));
                this.set('isValid', false);
            } else if (!this.isCorrectLength(value)) {
                // Check the length of the input string
                this.set('statusMessage', label + this.get('lengthQualifierText'));
                this.set('isValid', false);
            } else {
                // All validations at this level have passed
                this.set('statusMessage', '');
                this.set('isValid', true);
            }
        }
    }

});
