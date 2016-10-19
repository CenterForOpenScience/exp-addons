/*jshint node:true*/
'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
      moment: {
          includeLocales: true
      },
      localeTimeFormats: {
          //TODO: Verify time formats
          'am-ET': {
              longDateFormat: {
                  LT: "HH:mm"
              }
          },
          'lg-UG': {
              longDateFormat: {
                  LT: "HH:mm"
              }
          },
          'rk-UG': {
              longDateFormat: {
                  LT: "HH:mm"
              }
          },
          'ur': {
              longDateFormat: {
                  LT: "HH:mm"
              }
          }
      }
  };
};
