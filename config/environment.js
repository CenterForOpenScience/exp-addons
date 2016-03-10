/* jshint node: true */

module.exports = function(environment) {
  var ENV = {

    OSF: {
        clientId: process.env.OSF_CLIENT_ID,
        scope: process.env.OSF_SCOPE,
        url: process.env.OSF_URL
    },
    JAMDB: {
        url: 'http://localhost:1212',
        namespace: 'experimenter',
        authorizer: 'osf-jwt',
        testAccount: {
            id: 'tester0'
        }
    },

    modulePrefix: 'experimenter',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    'ember-simple-auth': {
        authenticationRoute: 'login'
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
