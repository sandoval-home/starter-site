import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function () {
    this.route('home', { path: '/Home'});
    this.route('styleguide', { path: '/Styleguide'});

});

export default Router;
