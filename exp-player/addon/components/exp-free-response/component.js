import ExpFrameBaseComponent from 'exp-player/components/exp-frame-base';
import layout from './template';
import { translationMacro as t } from "ember-i18n";
import {validator, buildValidations} from 'ember-cp-validations';

const MAX_LENGTH = 75;

var generateValidators = function(questions) {
  var validators = {};
  var presence = validator('presence', {
      presence:true,
      message: 'This field is required'
  });
  for (var question in questions) {
      var isOptional = questions[question].optional;
      if (!isOptional) {
        var key = 'questions.' + question + '.value';
        validators[key] = presence;
    }
  }
  return validators;
};

function getRemaining(value) {
    var length = 0;
    if (value !== null) {
      length = value.length;
    }
    return (MAX_LENGTH - length).toString();
}

const questions = {
  q1: {
    label: 'survey.sections.2.questions.11.label',
    value: null
  },
  q2: {
    label: 'survey.sections.2.questions.12.label',
    value: null
  },
  q3: {
    label: 'survey.sections.2.questions.13.label',
    value: null
  }
};

const Validations = buildValidations(generateValidators(questions));

export default ExpFrameBaseComponent.extend(Validations, {
    type: 'exp-free-response',
    layout: layout,
    i18n: Ember.inject.service(),
    questions: questions,
    diff1: Ember.computed('questions.q1.value', function() {
    var remaining = getRemaining(this.questions.q1.value);
    var translationKey = 'number' + remaining;
    var message = this.get('i18n').t('survey.sections.2.questions.11.characterCount').string;
    message = message.replace("75", this.get('i18n').t('number75').string);
    message = message.replace("0", this.get('i18n').t(translationKey).string);
    return message;
  }),
    diff2: Ember.computed('questions.q2.value', function() {
    var remaining = getRemaining(this.questions.q2.value);
    var translationKey = 'number' + remaining;
    var message = this.get('i18n').t('survey.sections.2.questions.12.characterCount').string;
    message = message.replace("##", this.get('i18n').t('number75').string);
    message = message.replace("0", this.get('i18n').t(translationKey).string);
    return message;
  }),
    diff3: Ember.computed('questions.q3.value', function() {
    var remaining = getRemaining(this.questions.q3.value);
    var translationKey = 'number' + remaining;
    var message = this.get('i18n').t('survey.sections.2.questions.13.characterCount').string;
    message = message.replace("##", this.get('i18n').t('number75').string);
    message = message.replace("0", this.get('i18n').t(translationKey).string);
    return message;
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
                // define data structure here
            }
        }
    }
});
