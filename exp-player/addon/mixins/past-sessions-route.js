import Ember from 'ember';

export default Ember.Mixin.create({
    setupController(controller, experiment) {
        this._super(controller, experiment);
        this.store.find(experiment.get(experiment.get('sessionCollectionId'))).then((sessions) => {
            controller.set('pastSessions', sessions);
        });
    }
});
