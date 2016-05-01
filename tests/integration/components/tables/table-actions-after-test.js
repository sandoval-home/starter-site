import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tables/table-actions-after', 'Integration | Component | tables/table actions after', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{tables/table-actions-after}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#tables/table-actions-after}}
      template block text
    {{/tables/table-actions-after}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
