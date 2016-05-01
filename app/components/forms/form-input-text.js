import FormInputString from 'nfors-app/components/_form-input-string';

/**
 * Input text form component is extended from the _form-input-string class
 *
 * Template properties specific to this component:
 *
 * @param {Number}  [minLength=null]
 * @param {Number}  [maxLength=null]
 * @param {Number}  [exactLength=null]
 * @param {Boolean} [enforceMaxLength=true]
 * @param {Boolean} [showCharacterCount=false]
 * 
 */

export default FormInputString.extend({

    // Ember hook for setting the component container tag type
    tagName: 'div',

    // Input element type
    inputType: 'text',

    // Data type that will be used in validation
    dataType: 'string'

});
