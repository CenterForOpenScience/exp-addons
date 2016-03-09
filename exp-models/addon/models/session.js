/*
Manage data about one or more documents in the sessions collection
 */

import Ember from 'ember';
import DS from 'ember-data';
import JamModel from '../mixins/jam-model';

export default DS.Model.extend(JamModel, {
    sequence: DS.attr(),
    softwareVersion: DS.attr('string'),
    expData: DS.attr(),  // Data is a reserved keyword in ember

    profileId: DS.attr('string'), // Store ID of related record
    profileVersion: DS.attr('string'), // TODO: Safe to always assume newest profile version?

    experimentId: DS.attr('string'),
    experimentVersion: DS.attr('string'),  // TODO: Currently this field is not acted on in any way

    completed: DS.attr('boolean'),  // Filter out sessions that were started, but never finished

    // Researchers can provide feedback to participants by writing to this field
    feedback: DS.attr('string'),
    // A flag for whether or not the participant has seen this feedback
    hasReadFeedback: DS.attr('boolean'),

    permissions: DS.attr(),

    history: DS.hasMany('history'),

    profile: Ember.computed('profileId', function() {
        // Get the profile record from within the specified account
        var model = this.store.findRecord('account', this.get('accountId'));  // TODO: Add a query by account version?
        model.profileById(this.get('profileId'));

    }),

    experiment: Ember.computed('experimentId', function() {
        var storeId = this.get('experimentId');
        return this.store.findRecord('experiment', storeId);
    })
});
