"use strict";

/* global studyUtils */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(EXPORTED_SYMBOLS|Feature)" }]*/

const { utils: Cu } = Components;
Cu.import("resource://gre/modules/Console.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

const EXPORTED_SYMBOLS = this.EXPORTED_SYMBOLS = ["Feature"];

XPCOMUtils.defineLazyModuleGetter(this, "RecentWindow",
  "resource:///modules/RecentWindow.jsm");


const BASERESOURCE = "perception-study";
XPCOMUtils.defineLazyModuleGetter(this, "studyUtils",
  `resource://${BASERESOURCE}/StudyUtils.jsm`);


// window utilities
function getMostRecentBrowserWindow() {
  return RecentWindow.getMostRecentBrowserWindow({
    private: false,
    allowPopups: false,
  });
}

/* TODO, glind Exports as class, not instance */
class Feature {
  constructor(config) {
    this.config = config;
    this.ui = new Notification();
    console.log(`Starting the thing with ${config}`);
    // configure the ui / treatment
  }
  // shutdown() {
  //   // TODO, nothing to do here, really.
  //   console.log("shutting down feature");
  //   return "shutdown";
  // }

  start() {
    const promptType = "notificationBox-strings-1";
    const config = this.config;
    const recentWindow = getMostRecentBrowserWindow();
    if (recentWindow && recentWindow.gBrowser) {
      // TODO glind promptType
      studyUtils.telemetry({ event: "prompted", promptType });
      this.ui.show(
        recentWindow.document,
        config, // msg text, etc.
        function onClickButtonCallback() {
          console.log("clicked!");
          // recentWindow.gBrowser.loadOneTab("about:pioneer", {
          //  inBackground: false,
          studyUtils.telemetry({ event: "engagedPrompt" });
        }
      );
    }
  }
}

class Notification {
  // functions related to notification box
  constructor() {
    // state
    this.notice = null;
    this.notificationBox = null;
  }
  show(doc, config) {
    // doc: a chrome doc
    // config:  notificationMessage,
    let { notice, notificationBox} = this;

    // only one at a time is allowed
    if (notice && notificationBox) {
      notificationBox.removeNotification(notice);
    }

    notificationBox = this.notifictionBox = doc.querySelector(
      "#high-priority-global-notificationbox",
    );

    const yesFirst = Number(Math.random() > .5);

    const packet = {
      event: "answered",
      yesFirst: "" + yesFirst,  // must be string.

    };

    var buttons = [{
      label: "yes",
      callback:  () => sendScorePacket({...packet, score: "1", label: "yes"}),
    },
    {
      label: "not sure",
      callback:  () => sendScorePacket({...packet, score: "0", label: "not sure"}),
    },
    {
      label: "no",
      callback:  () => sendScorePacket({...packet, score: "-1", label: "no"}),
    },
    ];

    if (!yesFirst) {
      buttons.reverse();
    }

    notice = this.notice = notificationBox.appendNotification(
      config.message,
      "57-engagement",
      `resource://${BASERESOURCE}/skin/heartbeat-icon.svg`, // TODO glind
      notificationBox.PRIORITY_INFO_HIGH,
      buttons, // buttons
      (eventType) => {
        if (eventType === "removed") {
          // Send ping about removing the study?
          studyUtils.endStudy({reason: "notification-closed"});
        }
      },
    );

    // from Pioneer-enrollment-study
    // Minimal attempts to style the notification like Heartbeat
    notice.style.background = "linear-gradient(-179deg, #FBFBFB 0%, #EBEBEB 100%)";
    notice.style.borderBottom = "1px solid #C1C1C1";
    notice.style.height = "40px";
    const messageText = doc.getAnonymousElementByAttribute(notice, "anonid", "messageText");
    messageText.style.color = "#333";
    const closeButton = doc.getAnonymousNodes(notice)[0].childNodes[1];
    if (closeButton) {
      if (doc.defaultView.matchMedia("(min-resolution: 2dppx)").matches) {
        closeButton.setAttribute("style", "-moz-image-region: rect(0, 32px, 32px, 0) !important;");
      } else {
        closeButton.setAttribute("style", "-moz-image-region: rect(0, 16px, 16px, 0) !important;");
      }
    }

    // Position the button next to the text like in Heartbeat
    const rightSpacer = doc.createElement("spacer");
    rightSpacer.flex = 20;
    notice.appendChild(rightSpacer);
    messageText.flex = 0;
    messageText.nextSibling.flex = 0;
  }
}


/*
const TREATMENTS = {
  notificationOldStudyPage() {
    initializeTreatment((promptType) => {
      const recentWindow = getMostRecentBrowserWindow();
      if (recentWindow && recentWindow.gBrowser) {
        showNotification(recentWindow.document, () => {
          recentWindow.gBrowser.loadOneTab("https://addons.mozilla.org/en-US/firefox/shield_study_16", {
            inBackground: false,
          });
          studyUtils.telemetry({ event: "engagedPrompt" });
        });
        studyUtils.telemetry({ event: "prompted", promptType });
      }
    });
  },

  notification() {
    initializeTreatment((promptType) => {
      const recentWindow = getMostRecentBrowserWindow();
      if (recentWindow && recentWindow.gBrowser) {
        showNotification(recentWindow.document, () => {
          recentWindow.gBrowser.loadOneTab("about:pioneer", {
            inBackground: false,
          });
          studyUtils.telemetry({ event: "engagedPrompt" });
        });
        studyUtils.telemetry({ event: "prompted", promptType });
      }
    });
  },

  notificationAndPopunder() {
    initializeTreatment((promptType) => {
      const recentWindow = getMostRecentBrowserWindow();
      if (recentWindow && recentWindow.gBrowser) {
        const tab = recentWindow.gBrowser.loadOneTab("about:pioneer", {
          inBackground: true,
        });

        showNotification(recentWindow.document, () => {
          recentWindow.gBrowser.selectedTab = tab;
          studyUtils.telemetry({ event: "engagedPrompt" });
        });
        studyUtils.telemetry({ event: "prompted", promptType });
      }
    });
  },

  popunder() {
    initializeTreatment((promptType) => {
      const recentWindow = getMostRecentBrowserWindow();
      if (recentWindow && recentWindow.gBrowser) {
        recentWindow.gBrowser.loadOneTab("about:pioneer", {
          inBackground: true,
        });
        studyUtils.telemetry({ event: "prompted", promptType });
      }
    });
  },
};
*/


async function getAllTelemetry() {
  return [{}, {}];
}

async function summarizeTelemetry() {
  const answer = {};
  return answer;
}



function sendScorePacket(packet) {
  studyUtils.telemetry(packet);
}



// Actually create the singleton.
// var studyUtils = new StudyUtils();

// to make this work with webpack!
// this.studyUtils = studyUtils;
