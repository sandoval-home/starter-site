import Ember from 'ember';
import sampleData from 'app/components/tables/utilities/sample-table-data';

export default Ember.Route.extend({

    // Default mock dataset
    mockDataset: 'set1',

    /**
     * Ember hook for setting the model on the controller/view layer
     *
     * @return {Object|Promise}
     */
    model: function () {
        return sampleData.get(this.get('mockDataset'));
    },

    /**
     * Ember hook for setting properties on the controller after all of
     * the route model hooks have run.
     */
    setupController: function () {
        // Call the parent class method
        this._super.apply(this, arguments);

        // Make the controller aware of which mock dataset is being used
        this.controller.set('mockDataset', this.get('mockDataset'));
    },

    /**
     * Ember Route actions
     */
    actions: {
        /**
         * Update the model data "behind the scenes"
         */
        toggleData: function () {
            if (this.get('mockDataset') === 'set1') {
                this.set('mockDataset','set2');
            } else {
                this.set('mockDataset','set1');
            }
            this.refresh();
        }
    }

});
