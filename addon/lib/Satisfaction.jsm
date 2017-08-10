Cu.import("resource://gre/modules/Services.jsm");



const questions = [
"Are you satisfied with Firefox ?",
"Do you like Firefox?",
"Would you recommend Firefox to a friend or family member?",
"Will you keep using Firefox in the future?",
"How do you feel about your Firefox experience?",
"How would you rate your Firefox experience?",
"Is Firefox performing up to your expectations?",
"Is Firefox is your favorite browser?",
];

class Satisfcation () {
  getChromeWindow() {
    return Services.wm.getMostRecentWindow("navigator:browser");
  }
  // https://github.com/mozilla/normandy/blob/master/recipe-client-addon/lib/Heartbeat.jsm
  notificationBar ({message}) {
    notificationBox = this.chromeWindow.document.querySelector("#high-priority-global-notificationbox");
    this.notice = this.notificationBox.appendNotification(
      message,
      // "heartbeat-" + this.options.flowId,
      null // "resource://shield-recipe-client/skin/shared/heartbeat-icon.svg",
      this.notificationBox.PRIORITY_INFO_HIGH,
      //this.buttons,
      eventType => {
        if (eventType !== "removed") {
          return;
        }
        //this.maybeNotifyHeartbeat("NotificationClosed");
      }
  };

const EXPORTED_SYMBOLS=['satisfcation'];

// to make this work with webpack!
this.EXPORTED_SYMBOLS = EXPORTED_SYMBOLS;
this.satisfcation = new Satisfcation();

