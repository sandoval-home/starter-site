import FormControlComponent from 'nfors-app/components/_form-control';

/**
 * This class extends from the _form-control class and is meant to
 * be extended to create groups of boolean-type form component inputs.
 *
 * This class does not include any mixins for validation routines. Because
 * the validation is boolean, the 'required' check in the _form-control class
 * is all that is currently needed.
 * 
 * Template components should not call this class directly
 * 
 */

export default FormControlComponent.extend({

    // Tumbleweeds....

    /**
     * Put things in here that extend to all boolean-type sub-classes
     */

});
