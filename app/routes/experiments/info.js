import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        var self = this;
        return this.store.find('experiment', params.experiment_id).then(function(experiment) {
            // When experiment loaded, ensure there are corresponding session models
            var collId = experiment.get('sessionCollectionId');

            return Ember.RSVP.hash({
                // The actual return of the model hook: two models, loaded sequentially
                experiment: experiment,
                sessions: self.store.findAll(collId)
            });
        });
    }
});
