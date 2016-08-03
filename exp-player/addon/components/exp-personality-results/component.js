import ExpFrameBaseComponent from 'exp-player/components/exp-frame-base';
import layout from './template';

var VALUES = {
    'measures.questions.5.options.disagreeStrongly': 1,
    'measures.questions.5.options.disagree': 2,
    'measures.questions.5.options.neutral': 3,
    'measures.questions.5.options.agree': 4,
    'measures.questions.5.options.agreeStrongly': 5
};

function averageScores(questions, reversed, items) {
    var total = score(questions, items) + reverseScore(reversed, items);
    return total / (questions.length + reversed.length);
}

function score(questions, items) {
    var total = 0;
    for (var i=0; i < questions.length; i++) {
        var question = questions[i];
        console.log(items[question - 1]);
        var value = items[question - 1].value;
        console.log(value);
        total += VALUES[value];
    }
    return total;
}

function reverseScore(questions, items) {
    var total = 0;
    for (var i=0; i < questions.length; i++) {
        var question = questions[i];
        var value = items[question - 1].value;
        total += (5 - VALUES[value]);
    }
    return total;
}


export default ExpFrameBaseComponent.extend({
    type: 'exp-personality-results',
    layout: layout,
    feedback: Ember.computed(function() {
      var data = this.get('session.expData')['0-0-rating-form'];
      var items = data['questions']['4'].items;
      var extraversion = averageScores([1, 11, 16, 26, 36], [6, 21, 31], items);
      var agreeableness = averageScores([7, 17, 22, 32, 42], [2, 12, 27, 37], items);
      var conscientiousness = averageScores([3, 13, 28, 33, 38], [8, 18, 23, 43], items);
      var neuroticism = averageScores([4, 14, 19, 19, 39], [9, 24, 34], items);
      var openness = averageScores([5, 10, 15, 20, 25, 30, 40, 44], [35, 41], items);
      return[
        {
          'score': extraversion,
          'description': {
            'high': 'feedback.hiExtra',
            'low': 'feedback.loExtra'
          }
        },
        {
          'score': agreeableness,
          'description': {
            'high': 'feedback.hiAgree',
            'low': 'feedback.loAgree'
          }
        },
        {
          'score': conscientiousness,
          'description': {
            'high': 'feedback.hiConsc',
            'low': 'feedback.loConsc'
          }
        },
        {
          'score': neuroticism,
          'description': {
            'high': 'feedback.hiNeurot',
            'low': 'feedback.loNeurot'
          }
        },
        {
          'score': openness,
          'description': {
            'high': 'feedback.hiOpen',
            'low': 'feedback.loOpen'
          }
        }]
    }),
    meta: {
        name: 'ExpPersonalityResults',
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
