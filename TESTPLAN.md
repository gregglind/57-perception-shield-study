# Test Plan for the 57-Perception-Study Addon

## Automated Testing

`npm test` does **optimistic testing** of the *commonest path* though the study for a user

- prove the notification bar ui opens
- *clicking on the left-most button presented*.
- verifying that sent Telemetry is correct.

Code at `test/functional_test.js`.


## Manual / QA TEST Instructions

Assumptions / Thoughts

1.  Please ask if you want  more command-line tools to do this testing.


### BEFORE EACH TEST: INSTALL THE ADDON to a CLEAN (NEW) PROFILE

0.  (create profile:  https://developer.mozilla.org/en-US/Firefox/Multiple_profiles, or via some other method)
1.  In your Firefox profile
2.  `about:debugging` > `install temporary addon`

As an alternative (command line) cli method:

1. `git clone` the directory.
2. `npm run firefox` from the Github (source) directory.


### Note: checking "Correct Pings"

All interactions with the UI create sequences of Telemetry Pings.

All UI `shield-study` `study_state` sequences look like this:

- `enter => install => (an ending) => exit`.


### Do these tests.

1.  UI APPEARANCE.  OBSERVE a notification bar like this:

    a.  Icon is 'heartbeat'
    b.  Text is one of 8 selected "questions", such as:  "Do you like Firefox?".  These are listed in `addon/Config.jsm` as `weightedVariations`.
    c.  buttons for click or 'yes | not sure | no'  OR 'no | not sure | yes'
    d.  an `x` button that closes the bar


2.  UI functionality: VOTE

    Click on a 'vote' button (yes | not sure | no) has these effects

    - bar closes
    - addon uninstalls
    - no additional tabs open
    - telemetry pings are 'correct'

        - ending with be `voted`

3.  UI functionality: 'X'

    Click on the 'x' button.

    - bar closes
    - addon uninstalls
    - no additional tabs open
    - telemetry pings are 'correct'

      - ending will be `notification-x`

4.  UI functionality  'close window'

    Open a 2nd firefox window.  Then close the initial window.

    - bar closes
    - addon uninstalls
    - no additional tabs open
    - telemetry pings are 'correct'

      - ending will be `window-or-fx-closed`



---
## Helper code and tips

### ***Chrome privileged console***
1.  `about:addons`
2.  `Tools > web developer console`


### **Telemetry Ping Printing Helper Code**

```
async function printPings() {
  async function getTelemetryPings (options) {
    const {type, n, timestamp, headersOnly} = options;
    Components.utils.import("resource://gre/modules/TelemetryArchive.jsm");
    // {type, id, timestampCreated}
    let pings = await TelemetryArchive.promiseArchivedPingList();
    if (type) pings = pings.filter(p => p.type === type);
    if (timestamp) pings = pings.filter(p => p.timestampCreated > timestamp);

    pings.sort((a, b) => b.timestampCreated - a.timestampCreated);
    if (n) pings = pings.slice(0, n);
    const pingData = headersOnly ? pings : pings.map(ping => TelemetryArchive.promiseArchivedPingById(ping.id));
    return Promise.all(pingData)
  }
  async function getPings() {
    const ar = ["shield-study", "shield-study-addon"];
    const out = {};
    out["shield-study"] = await getTelemetryPings({type: "shield-study"});
    out["shield-study-addon"] = await getTelemetryPings({type: "shield-study-addon"});
    return out;
  }
  const pings = await getPings();

  function display(pingsArray) {
    const payloads = pingsArray.map(x => x.payload).reverse();
    console.log(JSON.stringify(payloads,null,2))
  }
  console.log("// shield-study");
  display(pings['shield-study'])

  console.log("// shield-study-addon");
  display(pings['shield-study-addon'])

}

printPings()

```
