import FormControlComponent from 'nfors-app/components/_form-control';
import ValidationTypeCheckNumber from 'nfors-app/mixins/validation-type-check-number';
import FormControlNotValues from 'nfors-app/mixins/form-not-values';

/**
 * This class extends from the _form-control class and is meant to be extended to 
 * create number-type form component inputs that can be used in templates.
 *
 * This class includes a mixin that adds number-type validation routines. These
 * routines are used by the componentValidate() method
 *
 * This class also includes a mixin that allows the selection of prescribed not-values
 * 
 * Template components should not call this class directly
 * 
 */

export default FormControlComponent.extend(ValidationTypeCheckNumber, FormControlNotValues, {

    /**
     * Ember object initialization method
     */
    init: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Set validation properties on the object
        if (!this.get('ignoreModelValidation')) {
            this.setNumberValidationProperties();
        }
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
    }.observes('minValue',
               'maxValue',
               'exactValue',
               'positiveOnly',
               'negativeOnly',
               'decimalPlaces',
               'allowParens',
               'customRegexString'),

    /**
     * Validation initializer for the number input components. This runs any validation
     * that is baked into the component itself. This type of validation can be enabled or
     * disabled in the component. Validations passed from the controller will run in 
     * a separate method.
     *
     * Currently, string values are allowed, but only if one of the prescribed not-values. 
     * This may or may not be inline with the architecture of the application. If not, then
     * the allowance of not-values and subsequent conditional validation can be easily updated.
     *
     * This validation sequence first first checks the initial input string pattern, then 
     * resolves the input string into a type-valid number and proceeds with type, sign,
     * and range checking routines.
     *
     * @param {string} value 
     *
     * Calls the following methods from the validation-type-check-number Mixin:
     *  - isCorrectPattern()
     *  - characterResolver()
     *  - isCorrectType()
     *  - isCorrectSign()
     *  - isCorrectRange()
     */
    componentValidate: function (value) {
        var dataType,
            label,
            isNotValueSelected,
            resolver;

        // Call the parent class validations
        this._super.apply(this, arguments);

        // Determine if a prescribed not-value is selected
        isNotValueSelected = (this.get('notValueList') && this.isNotValue(value));

        // If the parent validations passed then proceed with component-specific validations
        if (value && !isNotValueSelected && this.get('isValid') !== false) {
            // Retrieve some basic component properties
            dataType = this.get('dataType');
            label = this.get('displayLabel');

            // Check the string pattern of the input
            if (!this.isCorrectPattern(dataType, value)) {
                // Set the custom validation message (or the default if no custom message)
                this.set('statusMessage', this.get('customValidationMessage') || label + this.get('patternQualifierText'));
                this.set('isValid', false);
            } else {
                // Resolve the formatted string input to a type-valid number format
                resolver = this.characterResolver(value);

                // If the type resolver was successful then run the type-specific validations
                if (resolver.completed) {
                    // Check the data type of the number
                    if (!this.isCorrectType(dataType, resolver.value)) {
                        this.set('statusMessage', label + this.get('typeQualifierText'));
                        this.set('isValid', false);
                    // Check the sign (+/-) of the number
                    } else if (!this.isCorrectSign(resolver.value)) {
                        this.set('statusMessage', label + this.get('signQualifierText'));
                        this.set('isValid', false);
                    // Check the range of the number
                    } else if (!this.isCorrectRange(resolver.value)) {
                        this.set('statusMessage', label + this.get('rangeQualifierText'));
                        this.set('isValid', false);
                    } else {
                        // All validations at this level have passed
                        this.set('statusMessage', '');
                        this.set('isValid', true);
                    }
                } else {
                    // If the resolver fails
                    this.set('statusMessage', label + this.get('resolverQualifierText'));
                    this.set('isValid', false);
                }
            }
        }
    }

});
