// app/components/exp-frame-base.js
import Ember from 'ember';

export default Ember.Component.extend({
    /** An abstract component for defining experimenter frames

     @property {string} id: the unique identifier for the _instance_
     @property {string} type: the static class-level type of this frame, e.g.: exp-consent-form
     @property {object} ctx: a deep copy of the exp-player context
     @property {integer} ctx.frameIndex: the current exp-player frameIndex
     **/
    id: null,
    type: null,
    ctx: null,
    meta: {
        name: 'Base Experimenter Frame',
        description: 'The abstract base frame for Experimenter frames.',
        parameters: {},  // Configuration parameters, which can be auto-populated from the experiment structure JSON
        data: {},  // Controls what and how parameters are serialized and sent to the server
    },
    eventTimings: [], // TODO: Simplify default values mechanism
    setupParams(params) {
        params = params || this.get('params');

        var defaultParams = {};
        Object.keys(this.get('meta.parameters').properties || {}).forEach((key) => {
            defaultParams[key] = this.get(`meta.parameters.properties.${key}.default`);
        });

        Ember.merge(defaultParams, params);
        return defaultParams;
    },
    onInit: function() {
        var defaultParams = this.setupParams();
        Object.keys(defaultParams).forEach((key) => {
            this.set(key, defaultParams[key]);
        });

        if (!this.get('id')) {
            var frameIndex = this.get('ctx.frameIndex');
            var type = this.get('type');
            this.set('id', `${type}-${frameIndex}`);
        }
    }.on('didReceiveAttrs'),
    actions: {
        setTimeEvent(eventName, extra) {
            // Track a particular timing event
            var curTime = new Date();
            var eventData = {
                eventType: eventName,
                timestamp: curTime.toISOString()
            };
            Ember.merge(eventData, extra || {});
            // Copy timing event into parent dict; TODO is there a more elegant way?
            var timings = this.get('eventTimings');
            timings.push(eventData);
            this.set('eventTimings', timings);
        },
        next() {
            this.send('setTimeEvent', 'nextFrame', {additionalKey: 'this is a sample event'});
            // When exiting frame, save the data to the base player using the provided saveHandler
            this.sendAction('saveHandler', this.get('id'), this.get('serializeContent').apply(this)); // todo ugly use of apply
            this.sendAction('next');
        },
        last() {
            this.sendAction('last');
        },
        previous() {
            this.sendAction('previous');
        }
    },
    serializeContent: function () {
        // Serialize selected parameters for this frame, plus eventTiming data
        var toSerialize = Object.keys(this.get('meta.data.properties') || {});
        var fields = new Map();
        var self = this;  // todo: do we need to do this?
        toSerialize.forEach(function(item) {
            fields[item] = self.get(item);
        });
        return {fields: fields, eventTimings: this.get('eventTimings')};
    }

});