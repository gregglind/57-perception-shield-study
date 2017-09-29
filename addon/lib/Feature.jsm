"use strict";


const { utils: Cu } = Components;
Cu.import("resource://gre/modules/Console.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");


/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(EXPORTED_SYMBOLS|Feature)" }]*/
const EXPORTED_SYMBOLS = this.EXPORTED_SYMBOLS = ["feature"];

const BASERESOURCE = "perception-study";

XPCOMUtils.defineLazyModuleGetter(this, "RecentWindow",
  "resource:///modules/RecentWindow.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "config",
  `resource://${BASERESOURCE}/Config.jsm`);

class Feature {
  constructor() {
    this.notificationBar = new Notification();
  }

  startup() {
    console.log(`Starting the thing with ${config}`);
    return "started";
  }

  shutdown() {
    console.log("shutting down feature");
    return "shutdown";
  }
}

class Notification {
  // functions related to notification box
  constructor() {
    // state
    this.notice = null;
    this.notificationBox = null;
  }
  show(doc, onClickButtonCallback) {

    // only one at a time is allowed
    if (this.notice && this.notificationBox) {
      try {
        this.notificationBox.removeNotification(this.notice);
      } catch (err) {
      // The dom nodes are probably gone. That's fine.
      }
    }

    this.notifictionBox = doc.querySelector(
      "#high-priority-global-notificationbox",
    );

    this.notice = this.notificationBox.appendNotification(
      config.notificationMessage,
      `${BASERESOURCE}`,
      `resource://${BASERESOURCE}/skin/heartbeat-icon.svg`,
      this.notificationBox.PRIORITY_INFO_HIGH,
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
    this.notice.style.background = "linear-gradient(-179deg, #FBFBFB 0%, #EBEBEB 100%)";
    this.notice.style.borderBottom = "1px solid #C1C1C1";
    this.notice.style.height = "40px";
    const messageText = doc.getAnonymousElementByAttribute(this.notice, "anonid", "messageText");
    messageText.style.color = "#333";
    const closeButton = doc.getAnonymousNodes(this.notice)[0].childNodes[1];
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
    this.notice.appendChild(rightSpacer);
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

// Actually create the singleton.
var feature = new Feature();
