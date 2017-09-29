"use strict";


const { utils: Cu } = Components;
Cu.import("resource://gre/modules/Console.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");


/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(EXPORTED_SYMBOLS|Feature)" }]*/
const EXPORTED_SYMBOLS = this.EXPORTED_SYMBOLS = ["Feature"];


XPCOMUtils.defineLazyModuleGetter(this, "RecentWindow",
  "resource:///modules/RecentWindow.jsm");


class Feature {
  startup(config) {
    console.log(`Starting the thing with ${config}`);
    return "started";
  }
  shutdown () {
    console.log('shutting down feature');
    return "shutdown";

  }
}

class Notification {
  // functions related to notification box
  constructor(props) {
    // state
    this.notice = null;
    this.notificationBox = null;
  }
  show(doc, onClickButtonCallback) {
    let { notice, notificationBox} = this

    // only one at a time is allowed
    if (notice && notificationBox) {
      notificationBox.removeNotification(notice);
    }

    notificationBox = this.notifictionBox = doc.querySelector(
      "#high-priority-global-notificationbox",
    );

    notice = this.notice = notificationBox.appendNotification(
      config.notificationMessage,
      "pioneer-enrollment-study-1",
      "resource://pioneer-enrollment-study/skin/heartbeat-icon.svg",
      notificationBox.PRIORITY_INFO_HIGH,
      [{
        label: "Tell me more",
        callback: onClickButtonCallback,
      }],
      (eventType) => {
        if (eventType === "removed") {
          // Send ping about removing the study?
        }
      },
    );

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

  getMostRecentBrowserWindow() {
    return RecentWindow.getMostRecentBrowserWindow({
      private: false,
      allowPopups: false,
    });
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


async function getAllTelemetry () {
 return [{}, {}]
}

async function summarizeTelemetry () {
  let answer = {};
  return answer;
}







// Actually create the singleton.
// var studyUtils = new StudyUtils();

// to make this work with webpack!
// this.studyUtils = studyUtils;
