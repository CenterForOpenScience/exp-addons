/* global swfobject */
import Ember from 'ember';

let {$, RSVP} = Ember;

const HOOKS = ['onRecordingStarted', 'onCamAccess', 'onFlashReady', 'onUploadDone'];

const ATTRIBUTES = {
  align: 'middle',
  id:   'VideoRecorder',
  name: 'VideoRecorder'
};

const FLASHVARS = {
  authenticity_token: '',
  lstext : 'Loading...',
  mrt: '120',
  qualityurl: 'audio_video_quality_profiles/320x240x30x90.xml',
  recorderId: '123',
  sscode: 'php',
  userId : 'XXY'
};

const PARAMS = {
  quality: 'high',
  bgcolor: '#dfdfdf',
  play: 'true',
  loop: 'false',
  allowscriptaccess: 'sameDomain',
  wmode: 'transparent'
};

export default Ember.Service.extend({
  height: 'auto',
  width: '100%',
  params: PARAMS,
  flashVars: FLASHVARS,
  attributes: ATTRIBUTES,

  divId: Ember.computed.alias('attributes.id'),
  sscode: Ember.computed.alias('flashVars.sscode'),
  videoId: Ember.computed.alias('flashVars.userId'),

  started: Ember.computed.alias('_started').readOnly(),
  camAccess: Ember.computed.alias('_camAccess').readOnly(),
  recording: Ember.computed.alias('_recording').readOnly(),

  debug: false,
  _started: false,
  _camAccess: false,
  _recording: false,

  _recordPromise: null,

  //Initial setup, installs flash hooks into the page
  init() {
    let self = this;
    HOOKS.forEach(hookName => {
      window[hookName] = function() {
        if (self.get('debug')) {console.log(hookName, arguments);}
        if (self['_' + hookName]) {self['_' + hookName].apply(self, arguments);}
        if (self[hookName]) {self[hookName].apply(self, arguments);}
      };
    });
  },

  //Insert the recorder and start recording
  //Returns a promise that resolve to true or false to indicate
  //whether or not recording has started.
  //IE a user might not have granted access to their webcam
  start(videoId, element, {config: config, hidden: hidden, record: record}={config: false, hidden: false, record: true}) {
    if (this.get('started')) {throw new Error('Video recorder already started');}
    if (typeof(videoId) !== 'string') {throw new Error('videoId must be a string');}

    this.set('_started', true);
    this.set('videoId', videoId);
    this.set('sscode', config ? 'asp' : 'php');

    $(element).append(`<div id="${this.get('divId')}-container" style="height:100%"></div`);
    $(`#${this.get('divId')}-container`).append(`<div id="${this.get('divId')}"></div`);

    if (hidden) {this.hide();}

    return new RSVP.Promise((resolve, reject) => {
      swfobject.embedSWF('VideoRecorder.swf', $(`#${this.get('divId')}`)[0], this.get('width'), this.get('height'), '10.3.0', '', this.get('flashVars'), this.get('params'), this.get('attributes'), vr => {
        if (!vr.success) {reject(new Error('Install failed'));}

        $('#' + vr.id).css('height', '100%');
        this.set('recorder', $('#' + vr.id)[0]);

        if (record) {return this.record();}
        return resolve(false);
      });
    });
  },

  // Pause the recorder
  pause() {
    if (this.get('recording')) {throw new Error('Never started recording');}
    this.get('recorder').pause();
    return true;
  },

  // Stop recording and save the video to the server
  // By default destroys the flash element
  stop({destroy: destroy}={destroy:false}) {
    if (this.get('recording')) {
        // Force at least 1.5 seconds of video to be recorded. Otherwise upload is never called
        if (1.5 - this.get('recorder').getStreamTime() > 0) {
            return setTimeout(this.stop.bind(this, {destroy: destroy}), 1.5 - this.get('recorder').getStreamTime());
        }
        this.get('recorder').stopVideo();
        this.set('_recording', false);
    }
    if (!this.get('started')) {return;}
    this.set('_started', false);
    if (destroy) {this.destroy();}
  },

  record() {
    if (!this.get('started')) {throw new Error('Must call start before record');}
    if (this.get('recording')) {throw new Error('Already recording');}
    let count = 0;
    let id = window.setInterval(() => {
        if (++count > 20) {return clearInterval(id), this.get('_recordPromise').reject(new Error('Could not start recording'));}
        if (!this.get('recorder').record) {return;}
        this.get('recorder').record();
        clearInterval(id);
    }, 100);
    return new Ember.RSVP.Promise((resolve, reject) => this.set('_recordPromise', {resolve, reject}));
  },

  // Uninstall the video recorder
  destroy() {
    // Seems that removing the swf object causes it to clean itself up
    // this.get('recorder').disconnectAndRemove();
    //TODO fix the flash error when destroying. Seems harmless for now...
    $(`#${this.get('divId')}-container`).remove();
    this.set('recorder', null);
    this.set('_recording', false);
    return true;
  },

  show() {
    $(`#${this.get('divId')}-container`).removeAttr('style');
    $(`#${this.get('divId')}-container`).css({height: '100%'});
    return true;
  },

  hide() {
    $(`#${this.get('divId')}-container`).css({
      'top': '-10000px',
      'left': '-10000px',
      'z-index': -1,
      'position': 'absolute'
    });
    return true;
  },

  on(eName, func) {
    if (HOOKS.indexOf(eName) === -1) {throw `Invalid event ${eName}`;}
    this.set(eName, func);
  },

  // Begin Flash hooks

  _onRecordingStarted(recorderId) { // jshint ignore:line
    this.set('_recording', true);
    if (this.get('_recordingPromise')) {this.get('_recordPromise').resolve(true);}
  },

  _onUploadDone() {
    this.set('_recording', false);
  },

  _onCamAccess(allowed, recorderId) { // jshint ignore:line
    this.set('_camAccess', allowed);
  }

  // End Flash hooks
});
