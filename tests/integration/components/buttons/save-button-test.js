import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('buttons/save-button', 'Integration | Component | buttons/save button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{buttons/save-button}}`);

  assert.equal(this.$().text().trim(), 'Save', 'Renders default text');

  // Template block usage:
  this.render(hbs`
    {{buttons/save-button text="template block text"}}
  `);

  assert.equal(this.$().text().trim(), 'template block text', 'Renders custom text');
});
