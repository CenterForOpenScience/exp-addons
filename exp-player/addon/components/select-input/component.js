import Ember from 'ember';
import layout from './template';

//h/t http://balinterdi.com/2015/08/29/how-to-do-a-select-dropdown-in-ember-20.html
export default Ember.Component.extend({
    currentUser: Ember.inject.service(),

    layout,
    options: [],
    value: null,

    displayOptions: Ember.computed('options', 'currentUser.isSensitive', function() {
        // If operating in a sensitive context, optionally remove any select-item options where the object contains
        //   a key `sensitive:true`
        const options = this.get('options');
        if (!this.get('currentUser.isSensitive')) {
            return options;
        }
        return options.filter(item => !item.sensitive);
    }),

    init() {
        this.get('currentUser');  // Ensure that we can set observer on lazy-loaded service injection
        return this._super(...arguments);
    }
});
