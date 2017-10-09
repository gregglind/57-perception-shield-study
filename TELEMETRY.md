# Telemetry sent by this addon

## Usual Firefox Telemetry is unaffected.

- No change: `main` and other pings are UNAFFECTED by this addon.
- Respects telemetry preferences.  If user has disabled telemetry, no telemetry will be sent.




## `shield-study` pings (common to all shield-studies)

`shield-studies-addon-utils` sends the usual packets.

The STUDY SPECIFIC ENDINGS this study supports are:

- "voted",
- "notification-x"
- "window-or-fx-closed"



## `shield-study-addon` pings, specific to THIS study.

Two kinds of events are instrumented in this study.

- UI


- VOTES



## Example Ping Sequence

Presented as split by bucket, but these occur intermixed.

```
// shield-study
[
  {
    "version": 3,
    "study_name": "57-perception-shield-study",
    "branch": "up-to-expectations-1",
    "addon_version": "1.0.0",
    "shield_version": "4.1.0",
    "type": "shield-study",
    "data": {
      "study_state": "enter"
    },
    "testing": true
  },
  {
    "version": 3,
    "study_name": "57-perception-shield-study",
    "branch": "up-to-expectations-1",
    "addon_version": "1.0.0",
    "shield_version": "4.1.0",
    "type": "shield-study",
    "data": {
      "study_state": "installed"
    },
    "testing": true
  },
  {
    "version": 3,
    "study_name": "57-perception-shield-study",
    "branch": "up-to-expectations-1",
    "addon_version": "1.0.0",
    "shield_version": "4.1.0",
    "type": "shield-study",
    "data": {
      "study_state": "ended-neutral",
      "study_state_fullname": "voted"
    },
    "testing": true
  },
  {
    "version": 3,
    "study_name": "57-perception-shield-study",
    "branch": "up-to-expectations-1",
    "addon_version": "1.0.0",
    "shield_version": "4.1.0",
    "type": "shield-study",
    "data": {
      "study_state": "exit"
    },
    "testing": true
  }
]
// shield-study-addon


[
  {
    "version": 3,
    "study_name": "57-perception-shield-study",
    "branch": "up-to-expectations-1",
    "addon_version": "1.0.0",
    "shield_version": "4.1.0",
    "type": "shield-study-addon",
    "data": {
      "attributes": {
        "event": "prompted",
        "promptType": "notificationBox-strings-1"
      }
    },
    "testing": true
  },
  {
    "version": 3,
    "study_name": "57-perception-shield-study",
    "branch": "up-to-expectations-1",
    "addon_version": "1.0.0",
    "shield_version": "4.1.0",
    "type": "shield-study-addon",
    "data": {
      "attributes": {
        "promptType": "notificationBox-strings-1",
        "event": "answered",
        "yesFirst": "1",
        "score": "0",
        "label": "not sure",
        "branch": "up-to-expectations-1",
        "message": "Is Firefox performing up to your expectations?"
      }
    },
    "testing": true
  }
]
```



