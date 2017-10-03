"use strict";

/* to use:

- Recall this file has chrome privileges
- Cu.import in this file will work for any 'general firefox things' (Services,etc)
  but NOT for addon-specific libs
*/

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(config|EXPORTED_SYMBOLS)" }]*/
var EXPORTED_SYMBOLS = ["config"];

var config = {
  "study": {
    "studyName": "57-perception-shield-study", // no spaces, for all the reasons
    // "forceVariation": {
    // }, // optional, use to override/decide
    "weightedVariations": [
      {
        "message": "Are you satisfied with Firefox?",
        "name": "satisfied-1",
        "weight": 1,
      },
      {
        "message": "Do you like Firefox?",
        "name": "like-1",
        "weight": 1,
      },
      {
        "message": "Would you recommend Firefox to a friend or family member?",
        "name": "recommend-1",
        "weight": 1,
      },
      {
        "message": "Will you keep using Firefox in the future?",
        "name": "keep-using-1",
        "weight": 1,
      },
      {
        "message": "Is Firefox performing up to your expectations?",
        "name": "up-to-expectations-1",
        "weight": 1,
      },
      {
        "message": "Is Firefox is your favorite browser?",
        "name": "favorite-1",
        "weight": 1,
      },
    ],
    /** **endings**
      * - keys indicate the 'endStudy' even that opens these.
      * - urls should be static (data) or external, because they have to
      *   survive uninstall
      * - If there is no key for an endStudy reason, no url will open.
      * - usually surveys, orientations, explanations
      */
    "endings": {
      /** standard endings */
      // NONE, this study has no surveys
    },
    "telemetry": {
      "send": true, // assumed false. Actually send pings?
      "removeTestingFlag": false,  // Marks pings as testing, set true for actual release
      // TODO "onInvalid": "throw"  // invalid packet for schema?  throw||log
    },
    // relative to bootstrap.js in the xpi
    // "studyUtilsPath": `./StudyUtils.jsm`,
  },
  "isEligible": async function() {
    // get whatever prefs, addons, telemetry, anything!
    // Cu.import can see 'firefox things', but not package things.
    return true;
  },
  "log": {
    // Fatal: 70, Error: 60, Warn: 50, Info: 40, Config: 30, Debug: 20, Trace: 10, All: -1,
    "bootstrap":  {
      "level": "Debug",
    },
    "studyUtils":  {
      "level": "Trace",
    },
  },
};
