# IA-EmberTestProject

This project is a starter sample for a front-end application in the Ember ~2.4 ecosystem.

A of 4.5.2016 this is basic functioning app that contains the skeleton structure of common modules. The common modules are works in progress and as they mature they will be moved back into the framework repo (IA-ModEmberJS)

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm cache clean && bower cache clean`
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit the tests at [http://localhost:4200/tests](http://localhost:4200/tests)

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

*Specify what it takes to deploy your app.*

## Further Reading

* [ember.js](http://emberjs.com/)
* [ember-cli](http://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## App Setup

These are the steps taken to build this app once the empty remote repo was cloned:

* Enter the project directory and run `ember-init`
* Create class directories for:
    * `/adapters`
    * `/authenticators`
    * `/initializers`
    * `/instance-initializers`
    * `/mixins`
    * `/serializers`
    * `/services`
    * `/transforms`
    * `/utilities`
* Create component directories for:
    * `/buttons`
    * `/forms`
    * `/menus`
    * `/tables`
* Update the `/tests/index.html` with `<head>` style that gets rid of weird empty box
* Include the LESS CSS pre-compiler:
     * `npm install --save-dev ember-cli-less`
* Replace `/styles/app.css` with `app.less`
* Create LESS module file structure and `@import` the files into `app.less`
* Include Moment.js library:
    * `bower install --save moment`
    * Update `ember-cli-build.js` with `app.import('bower_components/moment/moment.js')`
    * Update `.jshintrc` to include `moment` as a global/predef
* Include Numeral.js library:
    * `bower install --save numeral`
    * Update `ember-cli-build.js` with `app.import('bower_components/numeral/numeral.js')`
    * Update `.jshintrc` to include `numeral` as a global/predef
* TBD...  
