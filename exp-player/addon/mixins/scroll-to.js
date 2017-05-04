import Ember from 'ember';

/**
 * Provide reusable action for scrolling to the position of the specified element
 */
export default Ember.Mixin.create({
    actions: {
        scrollTo(selector) {
            Ember.$('html, body').scrollTop(this.$(selector).offset().top);
        }
    }
});
