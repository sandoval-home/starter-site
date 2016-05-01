import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tables/table-actions-before', 'Integration | Component | tables/table actions before', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{tables/table-actions-before}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#tables/table-actions-before}}
      template block text
    {{/tables/table-actions-before}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
