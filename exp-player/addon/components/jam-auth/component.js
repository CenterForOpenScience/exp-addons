import Ember from 'ember';
import ENV from 'isp/config/environment';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  namespace: ENV.JAMDB.namespace,
  collection: ENV.JAMDB.collection,

  studyId: null,
  participantId: null,

  actions: {
    authenticate() {
      this.get('login')({
        provider: 'self',
        username: this.get('participantId'),
        password: 'password',
        studyId: this.get('studyId'),
        namespace: this.get('namespace'),
        collection: this.get('collection')
      });
    }
  }
});
