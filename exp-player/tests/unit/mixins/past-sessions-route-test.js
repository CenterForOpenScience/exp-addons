import Ember from 'ember';
import PastSessionsRouteMixin from '../../../mixins/past-sessions-route';
import { module, test } from 'qunit';

module('Unit | Mixin | past sessions route');

// Replace this with your real tests.
test('it works', function(assert) {
  let PastSessionsRouteObject = Ember.Object.extend(PastSessionsRouteMixin);
  let subject = PastSessionsRouteObject.create();
  assert.ok(subject);
});
