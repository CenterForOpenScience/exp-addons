import Ember from 'ember';
import ExpFrameBaseComponent from 'exp-player/components/exp-frame-base';
import layout from './template';
import {validator, buildValidations} from 'ember-cp-validations';
import config from 'ember-get-config';
import moment from 'moment';


function getLength(value) {
    var length = 0;
    if (value !== undefined) {
        length = value.length;
    }
    return length.toString();
}

var presence = validator('presence', {
    presence: true,
    message: 'This field is required'
});

const Validations = buildValidations({
    q1: presence,
    q2: presence,
    q3: presence,
    q4: presence
});

export default ExpFrameBaseComponent.extend(Validations, {
    type: 'exp-free-response',
    layout: layout,
    i18n: Ember.inject.service(),
    diff1: Ember.computed('q1', function() {
        var length = getLength(this.get('q1'));
        var message = this.get('i18n').t('survey.sections.2.questions.11.characterCount').string;
        message = message.replace("0", length.toString());
        return message;
    }),
    diff2: Ember.computed('q2', function() {
        var length = getLength(this.get('q2'));
        var message = this.get('i18n').t('survey.sections.2.questions.12.characterCount').string;
        message = message.replace("0", length.toString());
        return message;
    }),
    diff3: Ember.computed('q3', function() {
        var length = getLength(this.get('q3'));
        var message = this.get('i18n').t('survey.sections.2.questions.13.characterCount').string;
        message = message.replace("0", length.toString());
        return message;
    }),
    times: Ember.computed(function() {
        var times = [];
        for (var i=0; i <= 24; i++) {
            var date = new Date(2016, 10, 17, i, 0, 0);
            var locale = this.get('i18n.locale');
            if (locale in config.localeTimeFormats) {
                // Add locale information not specified by moment.js
                moment.updateLocale(locale, config.localeTimeFormats[locale])
            }
            moment.locale(this.get('i18n.locale'));
            times.push(moment(date).format('LT'));
        }
        return times;
    }),
    q4: null,

    responses: Ember.computed('q1', 'q2', 'q3', 'q4', function() {
        return {
            q1: this.get('q1'),
            q2: this.get('q2'),
            q3: this.get('q3'),
            q4: this.get('q4')
        };
    }),

    allowNext: Ember.computed('validations.isValid', function() {
        if (config.validate) {
            return this.get('validations.isValid');
        }
        return true;
    }),

    meta: {
        name: 'ExpFreeResponse',
        description: 'TODO: a description of this frame goes here.',
        parameters: {
            type: 'object',
            properties: {
                // define parameters here
            }
        },
        data: {
            type: 'object',
            properties: {
                responses: {
                    type: 'object',
                    properties: {
                        q1: {
                            type: 'string'
                        },
                        q2: {
                            type: 'string'
                        },
                        q3: {
                            type: 'string'
                        },
                        q4: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    },
    actions: {
        continue() {
            if (this.get('allowNext')) {
                this.send('next');
            }
        }
    },
    loadData: function(frameData) {
        var responses = frameData.responses;
        this.set('q1', responses.q1);
        this.set('q2', responses.q2);
        this.set('q3', responses.q3);
        this.set('q4', responses.q4);
    }
});
