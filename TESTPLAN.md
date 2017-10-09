# Test Plan for the 57-Perception-Study Addon

## Automated Testing

`npm test` does **optimistic testing** of the commonest path though the study:

- *clicking on the first button presented*.
- verifying correct sent Telemetry.

Code at `test/functional_test.js`.


## Manual / QA TESTING.

Assumptions / Thoughts

1.  Please ask if you want  more command-line tools to debug this.


### BEFORE EACH TEST: INSTALL THE ADDON to a CLEAN PROFILE

1.  In a clean Firefox profile
2.  `about:debugging` > `install temporary addon`

### Tests

1.  UI APPEARANCE.  OBSERVE a notification bar like this:

    a.  Icon is 'heartbeat'
    b.  Text is one of 8 selected
    c.  buttons for click or 'yes | not sure | no'  OR 'no | not sure | yes'

2.  UI functionality: VOTE

    Click on a 'vote' button (yes | not sure | no) has these effects

    - bar closes
    - addon uninstalls
    - no additional tabs open
    - telemetry pings are 'correct'

3.  UI functionality: 'X'

    Click on the 'x' button.

    - bar closes
    - addon uninstalls
    - no additional tabs open
    - telemetry pings are 'correct'

4.  UI fucntionality  'close window'

    Open a 2nd firefox window.  Then close the initial window.

    - bar closes
    - addon uninstalls
    - no additional tabs open
    - telemetry pings are 'correct'





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
    console.log(JSON.stringify(pingsArray,null,2))
    //pingsArray.map(x => x.payload).reverse().forEach(x=>console.log(x))
  }
  console.log("## shield-study");
  display(pings['shield-study'])

  console.log("## shield-study-addon");
  display(pings['shield-study-addon'])

}

printPings()

```
