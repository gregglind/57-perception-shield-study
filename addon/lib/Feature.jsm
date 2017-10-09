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

class Feature {
  constructor(config) {
    this.config = config;
    this.ui = new Notification();
  }

  start() {
    // future-proof analysis if we change the look / style to icons
    const promptType = "notificationBox-strings-1";
    const config = {...this.config, promptType,};
    const recentWindow = getMostRecentBrowserWindow();

    if (recentWindow && recentWindow.gBrowser) {
      studyUtils.telemetry({ event: "prompted", promptType });
      this.ui.show(
        recentWindow,
        config,
      );
    }
    // the 'else' here could kill the study, NOT IMPLEMENTED
  }
}

class Notification {
  // functions related to notification box
  constructor() {
    // state
    this.notice = null;
    this.notificationBox = null;
    this.xclicked = false;
    this.voted = false;
  }

  show(chromeWindow, config) {
    // window: a chrome doc
    // config:  notificationMessage,
    const doc = chromeWindow.document;
    let { notice, notificationBox} = this;

    // only one notification at a time is allowed
    if (notice && notificationBox) {
      notificationBox.removeNotification(notice);

      // closing states
      this.voted = false;
      this.xclicked = false;
    }

    notificationBox = this.notifictionBox = doc.querySelector(
      "#high-priority-global-notificationbox",
    );

    // experiment whether uses gets 'yes first' or not
    // to check if order biases response
    const yesFirst = Number(Math.random() > .5);

    const baseVotePacket = {
      promptType: config.promptType,
      event: "answered",
      yesFirst: "" + yesFirst,  // must be string.
      score: null,
      label: null,
      branch: config.name,
      message: config.message
    };

    var onVoted = (fields) => {
      this.voted = true;
      studyUtils.telemetry({...baseVotePacket, ...fields});
    };

    // buttons and callbacks:
    // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/Method/appendNotification
    var buttons = [{
      label: "yes",
      callback:  () => onVoted({score: "1", label: "yes"}),
    },
    {
      label: "not sure",
      callback:  () => onVoted({score: "0", label: "not sure"}),
    },
    {
      label: "no",
      callback:  () => onVoted({score: "-1", label: "no"}),
    },
    ];

    if (!yesFirst) {
      buttons.reverse();
    }

    /* ENDINGS for Notification Box "notices"
     *
     * - user votes, sets 'voted' => "removed" => reason "voted"
     * - user clicks 'x', sets 'xclicked' => "removed" => reasons "notifiation-x"
     * - user closes window with the bar in it, or shuts down firefox
     *   => NO "removed" event, but we handle it using "SSWindowClosing"
     *      and send "window-or-fx-closed"
    `*/
    notice = this.notice = notificationBox.appendNotification(
      config.message,
      "57-engagement",
      `resource://${BASERESOURCE}/skin/heartbeat-icon.svg`, // TODO glind
      notificationBox.PRIORITY_INFO_HIGH,
      buttons, // buttons
      (eventType) => {
        if (eventType === "removed") {
          if (this.voted) {
            return studyUtils.endStudy({reason: "voted"});
          }
          if (this.xclicked) {
            return studyUtils.endStudy({reason: "notification-x"});
          }
          // shut down fx, or close the window
          //
        }
        return false;
      },
    );

    // handle the case where the window closed, but no 'x' clicked
    chromeWindow.addEventListener("SSWindowClosing", () => {
      if (this.voted || this.xclicked) return false;
      return studyUtils.endStudy({reason: "window-or-fx-closed"});
    });

    // append on the study info, so that we can use it for testing
    notice.setAttribute('data-study-config', JSON.stringify(config));


    // Minimal attempts to style the notification like Heartbeat
    // from Pioneer-enrollment-study
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
      closeButton.addEventListener("click", () => {
        // IMPORTANT, add click handler for 'x'
        this.xclicked = true;
      });
    }
    // Position the button next to the text like in Heartbeat
    const rightSpacer = doc.createElement("spacer");
    rightSpacer.flex = 20;
    notice.appendChild(rightSpacer);
    messageText.flex = 0;
    messageText.nextSibling.flex = 0;
  }
}
