import Ember from 'ember';
import layout from './template';

import {validator, buildValidations} from 'ember-cp-validations';
import config from 'ember-get-config';

import ExpFrameBaseComponent from '../../components/exp-frame-base/component';

function range(start, stop) {
    var options = [];
    for (var i = start; i <= stop; i++) {
        options.push({label: i, value: i});
    }
    return options;
}

var generateValidators = function (questions) {
    var validators = {};
    const presence = validator('presence', {
        presence: true,
        ignoreBlank: true,
        message: 'This field is required'
    });
    // We can't exclude the question from validation entirely without container access (to query currentUser service)
    // ...so instead we make sure the validator for that question is silently disabled.
    const sensitivePresence = validator('presence', {
        presence: true,
        disabled() {
            return this.get('currentUser.isSensitive');
        },
        ignoreBlank: true,
        message: 'This field is required'
    });

    for (let q = 0; q < questions.length; q++) {
        const item = questions[q];
        // Exclude the question from validators if it is optional (no validation needed), or sensitive (not
        // considered to exist for the purposes of this user)
        if (!item.optional) {
            let key = 'questions.' + q + '.value';
            if (item.sensitive) {
                validators[key] = sensitivePresence;
            } else {
                validators[key] = presence;
            }
        }
    }
    return validators;
};

const questions = [
    {
        question: 'survey.sections.1.questions.1.label',
        keyName: 'Age',
        type: 'select',
        scale: range(16, 100),
        value: null
    },
    {
        question: 'survey.sections.1.questions.2.label',
        keyName: 'Gender',
        type: 'select',
        scale: [
            {label: 'survey.sections.1.questions.2.options.male', value: 1},
            {label: 'survey.sections.1.questions.2.options.female', value: 2},
            {label: 'survey.sections.1.questions.2.options.other', value: 3},
            {label: 'survey.sections.1.questions.2.options.na', value: 4}
        ],
        value: null
    },
    {
        question: 'survey.sections.1.questions.3.label',
        keyName: 'Ethnicity',
        type: 'input',
        value: null,
        sensitive: true
    },
    {
        question: 'survey.sections.1.questions.4.label',
        keyName: 'Language',
        type: 'input',
        value: null
    },
    {
        question: 'survey.sections.1.questions.5.label',
        keyName: 'SocialStatus',
        type: 'radio',
        scale: range(1, 10),
        labelTop: false,
        formatLabel: 'negative-margin-top narrow-width',
        value: null,
        labels: [
            {
                rating: 1,
                label: 'survey.sections.1.questions.5.options.least'
            },
            {
                rating: 5,
                label: 'survey.sections.1.questions.5.options.average',
                formatClass: 'format-average-label'
            },
            {
                rating: 10,
                label: 'survey.sections.1.questions.5.options.most'
            }
        ]
    },
    {
        question: 'survey.sections.1.questions.6.label',
        keyName: 'BirthCity',
        type: 'input',
        value: null
    },
    {
        question: 'survey.sections.1.questions.11.label',
        keyName: 'BirthCountry',
        type: 'input',
        value: null
    },
    {
        question: 'survey.sections.1.questions.7.label',
        keyName: 'Residence',
        type: 'select',
        scale: [
            {label: 'survey.sections.1.questions.7.options.remoteRural', value: 1},
            {label: 'survey.sections.1.questions.7.options.rural', value: 2},
            {label: 'survey.sections.1.questions.7.options.suburban', value: 3},
            {label: 'survey.sections.1.questions.7.options.urban', value: 4}
        ],
        value: null
    },
    {
        question: 'survey.sections.1.questions.8.label',
        keyName: 'Religion1to10',
        type: 'radio',
        scale: range(1, 11),
        hiddenOptions: [11],
        labelTop: false,
        formatLabel: 'negative-margin-top narrow-width',
        value: null,
        labels: [
            {
                rating: 1,
                label: 'survey.sections.1.questions.8.options.notReligious'
            },
            {
                rating: 10,
                label: 'survey.sections.1.questions.8.options.highlyReligious'
            },
            {
                rating: 11,
                label: 'survey.sections.1.questions.8.options.preferNoAnswer'
            }
        ]
    },
    {
        question: 'survey.sections.1.questions.9.label',
        keyName: 'ReligionYesNo',
        type: 'radio',
        scale: [
            {label: 'survey.sections.1.questions.9.options.yesLabel', value: 1},
            {label: 'survey.sections.1.questions.9.options.noLabel', value: 2},
            {label: 'survey.sections.1.questions.9.options.preferNoAnswer', value: 3}
        ],
        labelTop: true,
        value: null
    },
    {
        question: 'survey.sections.1.questions.10.label',
        keyName: 'ReligionFollow',
        type: 'input',
        optional: true,
        value: null
    }];

const Validations = buildValidations(generateValidators(questions));

export default ExpFrameBaseComponent.extend(Validations, {
    currentUser: Ember.inject.service(),

    type: 'exp-overview',
    layout: layout,
    questions: Ember.computed('currentUser.isSensitive', function () {
        // Remove sensitive questions from the list of things to render (validators for them are disabled separately)
        const isSensitiveSite = this.get('currentUser.isSensitive');
        if (isSensitiveSite) {
            return questions.filter(item => !item.sensitive);
        } else {
            return questions;
        }
    }),
    pageNumber: 1,

    extra: {},
    isRTL: Ember.computed.alias('extra.isRTL'),

    showOptional: Ember.computed('questions.@each.value', function () {
        // The exact position of this question will vary because this survey is modified for sensitive locales
        const questions = this.get('questions');
        const item = questions.find(item => item.keyName === 'ReligionYesNo');
        return item.value === 1;
    }),
    responses: Ember.computed(function () {
        const questions = this.get('questions');
        let responses = {};

        // Questions with string values that should get serialized to integers (since select-input returns a string)
        //   (e.g. "16" --> 16)
        const specialCaseResponses = ['Age', 'Gender', 'Residence'];
        for (let i = 0; i < questions.length; i++) {
            const item = questions[i];
            const keyName = item.keyName;

            if (specialCaseResponses.includes(keyName)) {
                responses[keyName] = parseInt(item.value);
            } else {
                responses[keyName] = item.value;
            }
        }
        return responses;
    }).volatile(),
    allowNext: Ember.computed('validations.isValid', function () {
        if (config.featureFlags.validate) {
            return this.get('validations.isValid');
        }
        return true;
    }),
    meta: {
        name: 'ExpOverview',
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
                    // TODO: Specify *required* properties in future according to Json-schema syntax
                    //   https://spacetelescope.github.io/understanding-json-schema/reference/object.html#required-properties
                    type: 'object',
                    properties: {
                        'Age': {
                            type: 'integer'
                        },
                        'Gender': {
                            type: 'string'
                        },
                        'Ethnicity': {
                            type: 'string'
                        },
                        'Language': {
                            type: 'string'
                        },
                        'SocialStatus': {
                            type: 'integer'
                        },
                        'BirthCity': {
                            type: 'string'
                        },
                        'BirthCountry': {
                            type: 'string'
                        },
                        'Residence': {
                            type: 'string'
                        },
                        'Religion1to10': { // how religious?
                            type: 'integer'
                        },
                        'ReligionYesNo': { // follows religion?
                            type: 'string'
                        },
                        'ReligionFollow': {  // which religion?
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
    loadData: function (frameData) {
        for (var q = 0; q < this.get('questions').length; q++) {
            var question = this.get('questions')[q];
            var keyName = question.keyName;
            Ember.set(question, 'value', frameData.responses[keyName]);
        }
    }
});
