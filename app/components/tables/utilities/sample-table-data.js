import Ember from 'ember';

export default Ember.Object.create({

    set1: Ember.A([
        Ember.Object.create({
            id: 1,
            date: moment('3/20/2015', 'M/D/YYYY'),
            type: 'Sample 2',
            location: 'United States',
            count: 35.1
        }),
        Ember.Object.create({
            id: 2,
            date: moment('3/26/2015', 'M/D/YYYY'),
            type: 'Sample 1',
            location: 'Mexico',
            count: 1100.0
        }),
        Ember.Object.create({
            id: 3,
            date: moment('3/29/2015', 'M/D/YYYY'),
            type: 'Sample 3',
            location: 'Canada',
            count: 23
        })
    ]),

    set2: Ember.A([
        Ember.Object.create({
            id: 1,
            date: moment('4/18/2015', 'M/D/YYYY'),
            type: 'Sample 6',
            location: 'Kansas',
            count: 8.33333
        }),
        Ember.Object.create({
            id: 2,
            date: moment('4/11/2015', 'M/D/YYYY'),
            type: 'Sample 4',
            location: 'Delaware',
            count: 320.0988
        }),
        Ember.Object.create({
            id: 3,
            date: moment('4/26/2015', 'M/D/YYYY'),
            type: 'Sample 5',
            location: 'Idaho',
            count: 6600
        })
    ]),

});
