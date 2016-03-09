import Ember from 'ember';

export default Ember.Mixin.create({
    setupController(controller, model) {
        this._super(controller, model);
        var experiment = controller.get('experiment') || model;

        this.store.findAll(experiment.get('sessionCollectionId')).then((sessions) => {
            controller.set('pastSessions', sessions);
        });
    }
});
