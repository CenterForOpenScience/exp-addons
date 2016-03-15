var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs');

// h/t: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s07.html
var ISO_DATE_PATTERN = '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$';

var URL_PATTERN = '(http|https)://[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?';

var JAM_ID_PATTERN = '\\w+';
var PROFILE_ID_PATTERN = '\\w+\\.\\w+';


var CONFIG = {
    "type": "jsonschema",
    "schema": {
        "id": "config",
        "type": "object",
        "properties": {
            "profilesMin": {
                "id": "profilesMin",
                "type": "integer"
            },
            "profilesMax": {
                "id": "profilesMin",
                "type": "integer"
            }
        },
        "additionalProperties": true
    }
};

var EXPERIMENT = {
    "type": "jsonschema",
    "schema": {
        "id": "experiment",
        "type": "object",
        "properties": {
            "title": {
                "id": "title",
                "type": "string"
            },
            "description": {
                "id": "description",
                "type": "string"
            },
            "state": {
                "id": "state",
                "type": "string",
                "enum": ["Draft", "Active", "Archived", "Deleted"]
            },
            "beginDate": {
                "id": "beginDate",
                "format": "date-time",
                "type": ["string", "null"]
            },
            "endDate": {
                "id": "endDate",
                "format": "date-time",
                "type": ["string", "null"]
            },
            "structure": {
                "id": "structure",
                "type": "object"
            },
            "eligibilityCriteria": {
                "id": "eligibilityCriteria",
                "type": ["string", "null"]
            },
            "displayFullscreen": {
                "type": "boolean",
                "default": false
            },
            "exitUrl": {
                "type": "string"
                //"pattern": URL_PATTERN
            },
            "duration": {
                "type": ["string", "null"]
            },
            "purpose": {
                "type": ["string", "null"]
            }
        },
        "required": [
            "structure",
            "state"
        ]
        // "additionalProperties": false // TODO re-enable
    }
};

var SESSION = {
    "type": "jsonschema",
    "schema": {
        "id": "sessiontest0",  // Script creates one particular session collection associated with one single experiment
        "type": "object",
        "properties": {
            "completed": {
                "type": "boolean"
            },
            "profileId": {
                "id": "profileId",
                "type": "string",
                "pattern": PROFILE_ID_PATTERN
            },
            "profileVersion": {
                "id": "profileVersion",
                "type": "string"
            },
            "experimentId": {  // TODO: In the new collection-per-experiment sessions model, this field may be redundant
                "id": "experimentId",
                "type": "string",
                "pattern": JAM_ID_PATTERN
            },
            "experimentVersion": {
                "id": "experimentVersion",
                "type": "string"
            },
            "sequence": {
                "id": "sequence",
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "softwareVersion": {
                "id": "softwareVersion",
                "type": "string"  // TODO pattern? semver?
            },
            "expData": {
                "id": "expData",
                "type": "object"
            },
            feedback: {
                "id": "feedback",
                "type": "string"
            },
            "hasReadFeedback": {
                "id": "hasReadFeedback",
                "type": "boolean"
            }
        },
        "required": [
            "profileId", "profileVersion",
            "experimentId", "experimentVersion",
            "completed",
            "sequence", "softwareVersion",
            "expData"
        ]
        // "additionalProperties": false
    }
};

var ACCOUNT = {
    "type": "jsonschema",
    "schema": {
        "id": "account",
        "type": "object",
        "properties": {
            "username": {  // TODO can this be an id?
                "type": "string"
                // # "pattern": commonregex.email.pattern
            },
            "password": {
                "id": "password",
                "type": "string",
                "pattern": "^\\$2b\\$1[0-3]\\$\\S{53}$"
            },
            "profiles": {
                "type": "array",  // Could also do this as an object, as long as keys were guaranteed unique
                "items": {
                    "type": "object",
                    "properties": {
                        "profileId": {
                            "type": "string",
                            "pattern": PROFILE_ID_PATTERN
                        },
                        "firstName": {
                            "type": "string",
                            "pattern": "^\\w{3,64}"
                        },
                        "birthday": {
                            "type": "string",
                            "pattern": ISO_DATE_PATTERN
                        }
                    },
                    "required": ["firstName", "birthday"]
                }
            }
        },
        "required": ["username", "password"]
        // "additionalProperties": false
    }
};

// TODO RE-add account
module.exports = function main() {
    var base = path.dirname(__filename);
    rimraf.sync(`${base}/../schemas/*`);
    [CONFIG, EXPERIMENT, SESSION].forEach(function(schema) {
        var schemaData = JSON.stringify(schema, null, 4);
        var filename = schema.schema.id;
        fs.writeFile(`${base}/../schemas/${filename}.json`, schemaData);
    });
};
