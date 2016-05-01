import Ember from 'ember';
import FormControlComponent from 'nfors-app/components/_form-control';
import ValidationTypeCheckDatetime from 'nfors-app/mixins/validation-type-check-datetime';
import FormControlNotValues from 'nfors-app/mixins/form-not-values';

/**
 * This class extends from the _form-control class and is meant to be extended to
 * create date-type, time-type, or datetime-type form component inputs that can be used in templates.
 *
 * Methods exist for initializing and destroying date/time pickers and also for parsing and
 * sync-ing values in cases where the date/time value is made up of values from multiple inputs.
 *
 * This class also includes a mixin that adds date and time validation routines. These
 * routines are used by the componentValidate() method
 *
 * Template components should not call this class directly
 *
 */

export default FormControlComponent.extend(ValidationTypeCheckDatetime, FormControlNotValues, {

    // Default date display format
    dateDisplayFormat: 'MM/DD/YYYY',

    // Default time display format
    timeDisplayFormat: 'HH:mm',

    //Default datetime display format
    datetimeDisplayFormat: function () {

        return this.get('dateDisplayFormat') + ' ' + this.get('timeDisplayFormat');

    }.property('dateDisplayFormat', 'timeDisplayFormat'),

    // Default date storage format
    dateStorageFormat: 'YYYY-MM-DD HH:mm:ss',

    // Default time storage format
    timeStorageFormat: 'HH:mm:ss',

    // Default datetime storage format
    datetimeStorageFormat: 'YYYY-MM-DD HH:mm:ss',

    // Default UTC storage setting
    // Setting to true will ignore the storage format
    storeAsUTC: false,

    /**
     * Ember object initialization method
     */
    init: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Set validation properties on the object
        if (!this.get('ignoreModelValidation')) {
            this.setDatetimeValidationProperties();
        }
    },

    /**
     * Ember hook for catching the insertion of the component element
     * into the DOM.
     */
    didInsertElement: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Add an observer to the display proxy to resolve the component date and time values
        this.addObserver('displayProxy', this, this.updateDateAndTimeValues);
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
    }.observes('minDate',
               'maxDate',
               'minTime',
               'maxTime',
               'minDatetime',
               'maxDatetime'),

    /**
     * Create a date format for jQuery (which uses non-standard tokens) from
     * the more universal tokens used in the component validation mixin
     *
     * @return {string} pluginFormat
     */
    normalizeDateFormat: function () {
        var displayFormat = this.get('dateDisplayFormat'),
            pluginFormat;

        // Convert the more universal component date tokens into the more
        // unique tokens expected by jQuery
        pluginFormat = displayFormat.replace(new RegExp('YYYY', 'g'), 'yy');
        pluginFormat = displayFormat.replace(new RegExp('YY', 'g'), 'y');
        pluginFormat = pluginFormat.replace(new RegExp('MMM', 'g'), 'M');
        pluginFormat = pluginFormat.replace(new RegExp('MM', 'g'), 'mm');
        pluginFormat = pluginFormat.replace(new RegExp('DD', 'g'), 'dd');

        // Return the jQuery/plugin compatible date format
        return pluginFormat;
    },

    /**
     * Make any translations from the generic component datetime format
     * to the format expected by the plugin
     *
     * @return {string} pluginFormat
     */
    normalizeDatetimeFormat: function () {
        var datetimeFormat = this.get('datetimeDisplayFormat'),
            parserArray = [],
            timeFormat,
            hourFormat,
            pluginFormat;

        // Simple parse of the datetime format to isolate the time format
        parserArray = datetimeFormat.split(' ');
        // If a time format exists
        if (parserArray[1]) {
            // Simple parse of the time format to isolate the hour format
            timeFormat = parserArray[1];
            parserArray = timeFormat.split(':');
            hourFormat = parserArray[0];
        }

        // If the hour format is 12 hour
        if (hourFormat && hourFormat.indexOf('h') > -1) {
            // Remove hour leading zeros
            pluginFormat = datetimeFormat.replace('hh', 'h');
        } else {
            // Otherwise set the plugin format to the component format
            pluginFormat = datetimeFormat;
        }

        // Return the plugin datetime format
        return pluginFormat;

    },

    /**
     * Initialize the date picker drop-down. This involves establishing any configuration
     * values, such as min/max dates. It also involves normalizing the component date format
     * tokens into tokens recognized by the picker plugin. Finally, the picker is initialized
     * on the input.
     *
     * @param {Object} owner
     */
    initializeDatepicker: function (owner) {
        var dateFormat,
            minDate = null,
            maxDate = null,
            minYear = '1900',
            maxYear = '2099',
            quickSelect = this.get('quickSelect'),
            primaryInput,
            component = this;

        // Set any minimum and maximum date values
        if (this.get('minDate')) {
            minDate = new Date(moment(this.get('minDate')));
            minYear = moment(minDate).format('YYYY');
        }
        if (this.get('maxDate')) {
            maxDate = new Date(moment(this.get('maxDate')));
            maxYear = moment(maxDate).format('YYYY');
        }

        // Convert the universal date format tokens into those recognized by the plugin
        dateFormat = this.normalizeDateFormat();

        // Wait until the child elements load
        Ember.run.scheduleOnce('afterRender', this, function () {
            primaryInput = this.$(owner);

            // Identify the primary input element (other components may have been used in selectors)
            primaryInput.addClass('primary-input');
            this.set('dateInput', primaryInput);

            // Initialize the datepicker on the input
            primaryInput.datepicker({
                // Date format
                dateFormat: dateFormat,
                // Min and max date values (null is no limit)
                minDate: minDate,
                maxDate: maxDate,
                // Options for allowing quick-select of month and year
                changeMonth: quickSelect,
                changeYear: quickSelect,
                yearRange: minYear + ':' + maxYear,
                // Set the position of the datepicker below the input (helps avoid initial conflict with sticky scroll)
                beforeShow: function (inputElement, datepickerInstance) {
                    var offset = component.$(inputElement).offset(),
                        height = component.$(inputElement).height();

                    window.setTimeout(function () {
                        datepickerInstance.dpDiv.css({ top: (offset.top + height + 10) + 'px', left: offset.left + 'px' });
                    }, 1);
                },
                // Respond to changes in the month and year selector
                onChangeMonthYear: function(year, month/*, inst*/){
                    var selectedDate = component.$(this).datepicker('getDate'); // Returns Date object

                    // If date has been selected
                    if (selectedDate) {
                        // Update the month and year on the selected date
                        selectedDate.setMonth(month - 1); // month is 1-12, setMonth is 0-11
                        selectedDate.setFullYear(year);

                        component.$(this).datepicker('setDate', selectedDate);
                    }
                }
            });
        });
    },

    /**
     * Destroy the date picker drop-down by removing DOM elements and/or un-binding events
     */
    destroyDatepicker: function () {
        var dateInput = this.get('dateInput');

        // Remove jQuery datepicker functionality on the date input
        if (dateInput) {
            dateInput.datepicker('destroy');
        }
    },

    /**
     * Initialize the time picker drop-down. This involves binding an event watcher on the
     * primary input in ordet to toggle the selector. It also involves binding change events
     * to the selector inputs so the overall value can be updates as selections are made.
     *
     * @param {Object} owner
     */
    initializeTimepicker: function (owner) {
        var primaryInput;

        // Determine the individual time formats based on the overall time format
        this.setTimeFormats();

        // Wait for child elements to load, load their initial values, and place watchers on them
        Ember.run.scheduleOnce('afterRender', this, function () {
            primaryInput = this.$(owner);

            // Identify the primary input element (other components may have been used in selectors)
            primaryInput.addClass('primary-input');
            this.set('timeInput', primaryInput);

            // Use click delegation to toggle the selector element
            this.$(document).on('click touchstart', {scope: this, owner: primaryInput}, this.toggleTimeSelector);

            // Set the initial individual time properties passed in by the controller
            if (this.get('timeValue')) {
                this.setInitialTimeDisplayValues();
            }

            // Add onchange handlers to the time-selector form elements
            this.$('.hour-selector select').on('change', {scope: this}, this.viewSetHour);
            this.$('.minute-selector select').on('change', {scope: this}, this.viewSetMinute);
            this.$('.second-selector select').on('change', {scope: this}, this.viewSetSecond);

            // If the component displays a label then move the time selector down to account for the offset
            if (this.$(' > label').length) {
                this.$('.time-selector').css({
                    top: parseInt(this.$('.form-control-field').position().top) + parseInt(this.$('.form-control-input').height())
                });
            }

            // If this is a split component then adjust the position of the time selector
            if (this.$('.form-control-input-split.time').length) {
                if (this.get('splitOrientation') === 'horizontal') {
                    // If component is a horizontal split then adjust the left position
                    this.$('.time-selector').css({ left: this.$('.time').position().left });
                } else if (this.get('splitOrientation') === 'vertical') {
                    // If component is a vertical split then adjust the top position
                    this.$('.time-selector').css({top: parseInt(this.$('.time').position().top) + parseInt(this.$('.time').height())});
                }
            }
        });
    },

    /**
     * Destroy the time picker drop-down by removing DOM elements and/or un-binding events
     */
    destroyTimepicker: function () {
        // Unbind click delegation
        this.$(document).off('click touchstart', this.toggleTimeSelector);
        // TODO: Unbind focus and blur handlers
        //this.$('input').off('focusin blur', {scope: this}, this.toggleTimeSelector);

        // Unbind select change handlers
        this.$('.hour-selector select').off('change', this.viewSetHour);
        this.$('.minute-selector select').off('change', this.viewSetMinute);
        this.$('.second-selector select').off('change', this.viewSetSecond);
    },

    /**
     * Initialize the datetime picker drop-down. This involves establishing any configuration
     * values, such as min/max datetimes. It also involves normalizing the component datetime format
     * tokens into tokens recognized by the picker plugin. Finally, the picker is initialized
     * on the input.
     *
     * @param {Object} owner
     */
    initializeDatetimepicker: function (owner) {
        var datetimeFormat,
            minDatetime = false,
            maxDatetime = false,
            primaryInput;

        // Set any minimum and maximum datetime values
        if (this.get('minDatetime')) {
            minDatetime = new Date(moment(this.get('minDatetime')));
        }
        if (this.get('maxDatetime')) {
            maxDatetime = new Date(moment(this.get('maxDatetime')));
        }

        // Convert the universal date format tokens into those recognized by the plugin
        datetimeFormat = this.normalizeDatetimeFormat();

        // Wait for child elements to load
        Ember.run.scheduleOnce('afterRender', this, function () {
            primaryInput = this.$(owner);

            // Identify the primary input element (other components may have been used in selectors)
            primaryInput.addClass('primary-input');
            this.set('datetimeInput', primaryInput);

            // Add Bootstrap datetimepicker functionality to the datetime input
            primaryInput.datetimepicker({
                // Allow the picker to be inspected
                //debug: true,
                // Picker positioning
                widgetPositioning: {
                    horizontal: 'left',
                    vertical: 'bottom'
                },
                // Show the datepicker and timepicker together (no-toggling)
                sideBySide: true,
                // Display format
                format: datetimeFormat,
                // Initial min and max constriants
                minDate: minDatetime,
                maxDate: maxDatetime,
                // Combined with readonly on the element effectively disables manual input
                ignoreReadonly: true,
                // Do not overwrite dates that are outside min/max
                keepInvalid: true,
                // Specifies whether to auto-populate the input with the current date
                useCurrent: false
            // Picker hide event
            }).on('dp.hide', {scope: this}, function (event) {
                var component;

                // If the event object exists and has a data property
                if (event && event.data) {
                    // Set the component context
                    component = event.data.scope;
                    // If the event has a target and we have a component context
                    if (event.target && component) {
                        // Blur the form control in order to trigger a component value update
                        component.$(event.target).blur();
                    }
                }
            }).on('dp.show', {scope: this}, function (event) {
                var component = event.data.scope,
                    componentValue = component.get('value'),
                    defaultValue = component.get('defaultDisplayValue');

                // If the component value is blank and the default value exists
                if (!componentValue && defaultValue) {
                    // Set the default value as the component value
                    component.set('value', defaultValue);
                    // Update the plugin picker date so that the new date is highlighted
                    component.$('.form-control-input .primary-input').data('DateTimePicker').date(component.get('displayProxy'));
                }
            }).on('dp.change', { scope: this }, function (event) {
                var component = event.data.scope,
                    selectedDatetime = event.date.format(component.get('datetimeStorageFormat'));

                // Update the selector-defaults service with the updated datetime value
                component.selectorDefaults.set('defaultDatetime', selectedDatetime);
            });

            // Add observers to update the datetime picker UI  min/max constraints when
            // the component min/max values are updated
            this.addObserver('minDatetime', this, this.updateDatetimepickerMin);
            this.addObserver('maxDatetime', this, this.updateDatetimepickerMax);
        });
    },

    /**
     * Update the minDate property in the datetime picker to the component minDatetime
     */
    updateDatetimepickerMin: function () {
        var newMin = this.get('minDatetime'),
            newSelectorMin;

        if (newMin) {
            newSelectorMin = new Date(moment(newMin));
            if (newSelectorMin) {
                this.get('datetimeInput').data('DateTimePicker').minDate(newSelectorMin);
            }
        }
    },

    /**
     * Update the maxDate property in the datetime picker to the component maxDatetime
     */
    updateDatetimepickerMax: function () {
        var newMax = this.get('maxDatetime'),
            newSelectorMax;

        if (newMax) {
            newSelectorMax = new Date(moment(newMax));
            if (newSelectorMax) {
                this.get('datetimeInput').data('DateTimePicker').maxDate(newSelectorMax);
            }
        }
    },

    /**
     * Destroy the datetime picker drop-down by removing DOM elements and/or un-binding events
     */
    destroyDatetimepicker: function () {
        var datetimeInput = this.get('datetimeInput');

        // Remove the min/max selector update observers
        this.removeObserver('minDatetime', this, this.updateDatetimepickerMin);
        this.removeObserver('maxDatetime', this, this.updateDatetimepickerMax);

        // Remove Bootstrap datetimepicker functionality on the datetime input
        if (datetimeInput) {
            datetimeInput.datetimepicker('remove');
        }
    },

    /**
     * Toggle the time selector based on several factors, such as click location,
     * input status, and event type.
     *
     * @param {Object} event
     */
    toggleTimeSelector: function (event) {
        var component = event.data.scope;

        // If the input element itself was clicked then handle the toggling of the selector
        if (event.target.id === event.data.owner.attr('id')) {
            // If the input element is being entered
            if (event.type === 'click' || event.type === 'touchstart' || event.type === 'focusin') {
                if (component.get('timeValue')) {
                    // If the component value is populated then toggle the selector
                    component.$('.time-selector').slideToggle();
                } else {
                    // If the component value is not populated then only show the selector
                    component.$('.time-selector').slideDown();
                }
            // If the input element is being exited
            } else if (event.type === 'blur') {
                // TODO: Differentiate a click blur from a tab blur. If click then check if blurring click
                // was from .time-selector or not
                //component.$('.time-selector').slideUp();
            }
        } else if (component.$(event.target).closest('.time-selector').length === 0) {
            // Otherwise, see if the time selector iteself was clicked. If not then hide the time selector
            component.$('.time-selector').slideUp();
        }
    },

    // Private default position of the meridiem AM(0)-PM(1) selector - bound to HTML attributes,
    // which only accept numbers (as strings)
    // Updated automatically throughout lifecycle of object
    meridiemNum: '0',

    // Private default state for expecting a meridiem (AM-PM) value
    // Updated automatically upon reading timeFormat value
    meridiemExpected: false,

    /**
     * A simple helper to keep the main input hours updated with user selections from the
     * time selector hour element. Also makes unbinding the event watchers easier.
     *
     * @param {Object} event
     */
    viewSetHour: function (event) {
        var _this = event.data.scope;

        _this.set('hour', this.value);
    },

    /**
     * A simple helper to keep the main input minutes updated with user selections from the
     * time selector minute element. Also makes unbinding the event watchers easier.
     *
     * @param {Object} event
     */
    viewSetMinute: function (event) {
        var _this = event.data.scope;

        _this.set('minute', this.value);
    },

    /**
     * A simple helper to keep the main input seconds updated with user selections from the
     * time selector minute element. Also makes unbinding the event watchers easier.
     *
     * @param {Object} event
     */
    viewSetSecond: function (event) {
        var _this = event.data.scope;

        _this.set('second', this.value);
    },

    /**
     * Parse the timeFormat to later determine which values to expect from
     * the multiple time-selector inputs
     */
    setTimeFormats: function () {
        var timeFormat,
            timeFormatArray;

        // Get the time format without the meridiem token
        timeFormat = this.get('timeDisplayFormat').split(' ').shift();
        // Split the time format into hours/minutes/etc tokens
        timeFormatArray = timeFormat.split(':');

        // Set hour format as the first array value
        this.set('hourFormat', timeFormatArray[0]);

        // Set minute format as the second array value
        this.set('minuteFormat', timeFormatArray[1]);

        // Set second format as the first array value
        this.set('secondFormat', timeFormatArray[2]);

        // If hours is h (vs. H) then require meridiem
        if (this.get('hourFormat').indexOf('h') > -1) {
            this.set('meridiemExpected', true);
        }
    },

    /**
     * Set the initial individual time properties (hour, minute, etc.) based in the initial value
     */
    setInitialTimeDisplayValues: function () {
        var timeParts = this.partsResolver(this.get('timeDisplayFormat'), this.get('timeValue')),
            meridiemNum = this.get('meridiemNum');

        // Determine the meridiem number (for the input value) from the meridiem text
        if (timeParts.meridiem) {
            if (timeParts.meridiem === 'AM') {
                meridiemNum = '0';
            } else if (timeParts.meridiem === 'PM') {
                meridiemNum = '1';
            }
        }

        // Determine the hour based on the display format
        if (this.get('timeDisplayFormat').indexOf('h') > -1) {
            if (timeParts.hour > 12) {
                this.set('hour', timeParts.hour - 12);
            } else if (timeParts.hour === 0) {
                this.set('hour', timeParts.hour + 12);
            } else {
                this.set('hour', timeParts.hour);
            }
        } else {
            if (timeParts.hour < 10) {
                this.set('hour', '0' + timeParts.hour);
            } else {
                this.set('hour', timeParts.hour);
            }
        }

        // Maintain leading zeros on single-digit minutes
        if (parseInt(timeParts.minute) < 10) {
            this.set('minute', '0' + timeParts.minute);
        } else {
            this.set('minute', timeParts.minute);
        }

        // Maintain leading zeros on single-digit minutes
        if (parseInt(timeParts.second) < 10) {
            this.set('second', '0' + timeParts.second);
        } else {
            this.set('second', timeParts.second);
        }

        this.set('millisecond', timeParts.millisecond);
        this.set('meridiemNum', meridiemNum);

    },

    /**
     * This property generates the list of values for the hours drop-down.
     * The values will be different depending on the time format (1-12 or 00-23)
     *
     * @return {Array} hours
     */
    hoursOptionValues: function () {
        var hours = [],
            hoursFormat = this.get('timeDisplayFormat').substr(0, 2),
            numHours,
            hour,
            i;

        // Set the number of options based on the time format
        // The loop operator will be <, hence the 24 and 13
        numHours = (hoursFormat.indexOf('h') > -1) ? 13 : 24;
        // Set the loop counter start based on the time format
        i = (numHours === 24) ? 0 : 1;

        // Loop to populate the array with objects of value and label pairs
        for (i; i < numHours; i += 1) {
            // Create 24-hour time entries with a leading zero as needed
            hour = (numHours === 24 && i < 10) ? ('0' + String(i)) : String(i);
            // Push the value and label to the hours array
            hours.push({ value: hour, label: hour });
        }

        // Return the hours array of objects
        return hours;

    }.property(),

    /**
     * This property generates the list of values for the minutes drop-down.
     *
     * @return {Array} minutesSeconds
     */
    minutesSecondsOptionValues: function () {
        var minutesSeconds = [],
            minuteSecond,
            i;

        // Loop to populate the array with objects of value and label pairs
        for (i = 0; i < 60; i += 1) {
            minuteSecond = (i < 10) ? ('0' + String(i)) : String(i);
            minutesSeconds.push({ value: minuteSecond, label: minuteSecond });
        }

        // Return the array of minutes/seconds objects
        return minutesSeconds;

    }.property(),

    /**
     * Observe the individual time properties and keep the input text and
     * the in-sync with individual time-selector selections.
     */
    syncInputTime: function () {
        var timeValue = '',
            meridiem,
            isHourSelected = false,
            isMinuteSelected = false,
            isSecondSelected = false,
            isMillisecondSelected = true, // Not evaluated at the moment
            isMeridiemSelected = false;

        // Determine if all required time components are selected
        // TODO: More elegent way to do this?

        // Hour
        if (this.get('hourFormat')) {
            if (this.get('hour')) {
                isHourSelected = true;
                timeValue += this.get('hour');
            }
        } else {
            isHourSelected = true;
        }

        // Minute
        if (this.get('minuteFormat')) {
            if (this.get('minute')) {
                isMinuteSelected = true;
                timeValue += ':' + this.get('minute');
            }
        } else {
            isMinuteSelected = true;
        }

        // Second
        if (this.get('secondFormat')) {
            if (this.get('second')) {
                isSecondSelected = true;
                timeValue += ':' + this.get('second');
            }
        } else {
            isSecondSelected = true;
        }

        // Meridiem
        if (this.get('meridiemExpected')) {
            if (this.get('meridiemNum')) {
                isMeridiemSelected = true;
                if (this.get('meridiemNum') === '0') {
                    meridiem = 'AM';
                } else if (this.get('meridiemNum') === '1') {
                    meridiem = 'PM';
                }
                timeValue += ' ' + meridiem;
            }
        } else {
            isMeridiemSelected = true;
        }

        // If all required components (based on timeFormat) are selected then update the input value
        if (isHourSelected && isMinuteSelected && isSecondSelected && isMillisecondSelected && isMeridiemSelected) {
            // Update the time picker inputs
            this.$('.hour-selector select').val(this.get('hour'));
            this.$('.minute-selector select').val(this.get('minute'));
            this.$('.second-selector select').val(this.get('second'));

            // Update the display value on the component
            if (this.get('displayProxy') !== undefined) {
                this.set('displayProxy', timeValue);
            } else {
                this.set('timeValue', timeValue);
            }
        } else {
            // Otherwise set the display value on the component to blank
            if (this.get('displayProxy') !== undefined) {
                this.set('displayProxy', '');
            } else {
                this.set('timeValue', '');
            }
        }

    }.observes('hour', 'minute', 'second', 'millisecond', 'meridiemNum'),

    /**
     * For date/time components where the input display value is different from the value stored
     * in the model, a generic display property is used (displayProxy). This observer watches the
     * displayProxy and updates the dateValue, timeValue, or datetimeValue on the object.
     */
    updateDateAndTimeValues: function () {

        if (this.get('dataType') === 'datetime') {
            // Update the object datetimeValue with the value from the input
            this.set('datetimeValue', this.get('displayProxy'));
        } else if (this.get('dataType') === 'date') {
            // Update the object dateValue with the value from the input
            this.set('dateValue', this.get('displayProxy'));
        } else if (this.get('dataType') === 'time') {
            // Update the object timeValue with the value from the input
            this.set('timeValue', this.get('displayProxy'));
        }

    },

    /**
     * Watch the component value and not-value to keep the display in-sync if the
     * model/binding is updated behind the scenes
     */
    updateDisplayProxy: function () {
        var value = this.get('value'),
            notValue = this.get('notValue'),
            displayProxy,
            dataType,
            displayFormat;

        // If a valid not-value is assigned then update the displayProxy to null
        if (notValue && !value) {
            this.set('displayProxy', null);
        } else {
            // Otherwise set up some comparison values
            displayProxy = this.get('displayProxy');
            dataType = this.get('dataType');
            displayFormat = this.get(dataType + 'DisplayFormat');

            // If the the model/binding changed behind the scenes and we need to update the UI displayProxy
            if (value && moment(value).format(displayFormat) !== displayProxy) {
                // Remove the displayProxy observer, update the displayProxy, re-add the observer
                this.removeObserver('displayProxy', this, this.updateDateAndTimeValues);
                this.set('displayProxy', moment(value).format(displayFormat));
                this.addObserver('displayProxy', this, this.updateDateAndTimeValues);
            } else if (!value && displayProxy) {
                // Remove the displayProxy observer, unset the displayProxy, re-add the observer
                this.removeObserver('displayProxy', this, this.updateDateAndTimeValues);
                this.set('displayProxy', '');
                this.addObserver('displayProxy', this, this.updateDateAndTimeValues);
            }
        }

    }.observes('value', 'notValue'),

    /**
     * Determine which type of component is being updated (date, time, datetime, etc)
     * and update the value property on the component. The value property is likely
     * bound to a model property via the controller.
     *
     * Component properties such as *StorageFormat and storeAsUTC are evaluated to
     * craft a properly formatted date/time to send back to the controller/model.
     */
    updateComponentValue: function () {
        var dateValue = this.get('dateValue'),
            timeValue = this.get('timeValue'),
            datetimeValue = this.get('datetimeValue'),
            value,
            storageFormat;

        // Determine the type of component and set the value and storage format accordingly
        if (dateValue && timeValue) {
            // Datetime split
            value = moment(dateValue + ' ' + timeValue, this.get('datetimeDisplayFormat'));
            storageFormat = this.get('datetimeStorageFormat');
        } else if (dateValue) {
            // Date
            value = moment(dateValue, this.get('dateDisplayFormat'));
            storageFormat = this.get('dateStorageFormat');
        } else if (timeValue && this.get('saveWithDate')) {
            // Time (as datetime)
            value = moment(moment().format(this.get('dateDisplayFormat')) + ' ' + timeValue, this.get('datetimeDisplayFormat'));
            storageFormat = this.get('datetimeStorageFormat');
        } else if (timeValue) {
            // Time (as time only)
            value = moment(timeValue, this.get('timeDisplayFormat'));
            storageFormat = this.get('timeStorageFormat');
        } else if (datetimeValue) {
            // Datetime (not split)
            value = moment(datetimeValue, this.get('datetimeDisplayFormat'));
            storageFormat = this.get('datetimeStorageFormat');
        } else {
            value = null;
        }

        // If the date/time value exists then format it for storage
        if (value) {
            if (this.get('storeAsUTC')) {
                // UTC format
                value = moment.utc(value).format();
            } else {
                // Custom format
                value = moment(value).format(storageFormat);
            }
        }

        // Set the value on the component object (likely bound to the controller)
        this.set('value', value);

    }.observes('dateValue', 'timeValue', 'datetimeValue'),

    /**
     * Validation initializer for the date and time input components. This runs any validation
     * that is baked into the component itself. This type of validation can be enabled or
     * disabled in the component. Validations passed from the controller will run in
     * a separate method.
     *
     * This validation sequence first first checks the initial input string pattern, then
     * proceeds with type, sign, and range checking routines
     *
     * @param {string} value
     *
     * Calls the following methods from the validation-type-check-datetime Mixin:
     *  - propertyResolver()
     *  - isCorrectPattern()
     *  - isCorrectType()
     *  - isCorrectRange()
     */
    componentValidate: function (value) {
        var dataType,
            label,
            propertyNames;

        // Call the parent class validations
        this._super.apply(this, arguments);

        // If the parent validations passed then proceed with component-specific validations
        if (value && typeof value === 'string' && this.get('isValid') !== false) {
            // Retrieve some basic component properties
            dataType = this.get('dataType');
            label = this.get('displayLabel');
            propertyNames = this.propertyResolver(dataType);

            // Check the string pattern of the input
            if (!this.isCorrectPattern(dataType, value)) {
                this.set('statusMessage', this.get('customValidationMessage') || label + this.get(propertyNames.patternQualifierTextProperty));
                this.set('isValid', false);
            // Check the data type of the input
            } else if (!this.isCorrectType(dataType, value)) {
                this.set('statusMessage', label + this.get(propertyNames.typeQualifierTextProperty));
                this.set('isValid', false);
            // Check the range of the input
            } else if (!this.isCorrectRange(dataType, value)) {
                this.set('statusMessage', label + this.get(propertyNames.rangeQualifierTextProperty));
                this.set('isValid', false);
            } else {
                // All validations at this level have passed
                this.set('statusMessage', '');
                this.set('isValid', true);
            }
        }
    }

});
