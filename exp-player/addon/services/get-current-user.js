import Ember from 'ember';

export default Ember.Service.extend({
    store: Ember.inject.service(),
    load: function() {
        // TODO work for real
        return this.get('store'). findRecord('account', 'experimenter.accounts.tester0').then((account) => {
            return [account, account.get('profiles')[0]];
        });
    }
});
