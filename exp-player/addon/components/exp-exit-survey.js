import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

import moment from 'moment';

import layout from '../templates/components/exp-exit-survey';

import ExpFrameBaseComponent from 'exp-player/components/exp-frame-base';
import FullScreen from '../mixins/full-screen';

let {
    $
} = Ember;

const Validations = buildValidations({
    birthDate: validator('presence', {
        presence: true,
        message: 'This field is required'
    }),
    useOfMedia: validator('presence', {
        presence: true,
        message: 'This field is required'
    }),
    shareVideo: validator('presence', {
        presence: true,
        message: 'This field is required'
    })
});

export default ExpFrameBaseComponent.extend(Validations, {
     layout: layout,
     type: 'exp-exit-survey',
     meta: {
         name: 'ExpExitSurvey',
         description: 'Exit survey for Lookit.',
         parameters: {
             type: 'object',
             properties: {
                 id: {
                     type: 'string',
                     description: 'A unique identifier for this item'
                 },
             required: ['id']
            }
        },
        data: {
            type: 'object',
            properties: {
                formData: {
                    type: 'object',
                    default: {}
                },
                birthDate: {
                    type: 'string',
                    default: null
                },
                shareVideo: {
                    type: 'string'
                },
                useOfMedia: {
                    type: 'string'
                },
                withdrawal: {
                    type: 'string'
                },
                feedback: {
                    type: 'string'
                },
                idealSessionsCompleted: {
                    type: 'integer',
                    default: 3
                },
                idealDaysSessionsCompleted: {
                    type: 'integer',
                    default: 14
                },
                exitMessage: {
                    type: 'string'
                },
                exitThankYou: {
                    type: 'string'
                }
            }
        },

    },
    section1: true,
    showValidation: false,
    actions: {
        continue() {
            if (this.get('validations.isValid')) {
                this.set('section1', false);
                this.send('save');
            } else {
                this.set('showValidation', true);
            }
        },
        finish() {
            this.send('next');
        }
    },
    currentSessionsCompleted: Ember.computed('frameContext', function() {
        var pastSessions = this.get('frameContext.pastSessions');
        if (pastSessions) {
            return pastSessions.get('length') || 1;
        }
        return 1;
    }),
    currentDaysSessionsCompleted: Ember.computed('frameContext', function() {
        // Warning, this implementation may be inaccurate
        // TODO, figure out what the client's expected behavior is here and resolve
        // https://openscience.atlassian.net/browse/LEI-111
        var pastSessionDates = this.get('frameContext.pastSessions').map((session) => {
            return moment(session.get('createdOn'));
        });
        var minDate = moment.min(pastSessionDates);
        var maxDate = moment.max(pastSessionDates);

        return maxDate.diff(minDate, 'days') + 1;
    }),
    progressValue: Ember.computed('currentSessionsCompleted', 'idealSessionsCompleted', function() {
        return Math.ceil((this.get('currentSessionsCompleted') / this.get('idealSessionsCompleted')) * 100);
    })

});
