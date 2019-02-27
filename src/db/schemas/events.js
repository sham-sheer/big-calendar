// const eventSchema =  {
//   "title": 'event schema',
//   "version": 0,
//   "description": 'describes a calendar event',
//   "type": 'object',
//   "properties": {
//     "id": {
//       'type': 'string',
//       'primary': true
//     },
//     "summary": {
//       'type': 'string',
//       'default' : 'Calendar Event'
//     },
//     "start": {
//       "type": "object",
//       "properties": {
//           "dateTime": {
//               "type": "string"
//           },
//           "timezone": {
//               "type": "string"
//           }
//       }
//     },
//     "end": {
//       "type": "object",
//       "properties": {
//           "dateTime": {
//               "type": "string"
//           },
//           "timezone": {
//               "type": "string"
//           }
//       }
//     },
//     "allDay": {
//       'type': 'boolean'
//     },
//     "organizer": {
//       "type":"object",
//       "properties": {
//         "id": "string",
//         "email": "string",
//         "displayName": "string",
//         "self": "boolean"
//       }
//     },
//     "recurrence" : {
//       "type": "array",
//       "item": {
//         "type": "string"
//       }
//     },
//     "iCalUID": {
//       "type": "string"
//     },
//     "attendees": {
//       "type": "array",
//       "item": {
//         "type": "object",
//         "properties": {
//             "id": "string",
//             "email": "string",
//             "displayName": "string",
//             "organizer": "boolean",
//             "self": "boolean",
//             "resource": "boolean",
//             "optional": "boolean",
//             "responseStatus": "string",
//             "comment": "string",
//             "additionalGuests": "number"
//         }
//       }
//     }
//   },
//   "required": ['end', 'start']
// }

// export default eventSchema;

export default {
  "title": "Event schema",
  "version": 0,
  "description": "Describes a calendar event",
  "type": "object",
  "properties": {
    // ----------------------------------------------- //
    "eventId": {
      "type": "string",
      "primary": true,
    },
    // ----------------------------------------------- //
    "status": {
      "type": "string",
      "default" : "confirmed"
    },
    "created": {
      "type": "object",
      "description": "Time the event was created",
      "properties": {
        "dateTime": {
          "type": "string"
        },
        "timezone": {
          "type": "string"
        }
      },
      "final": true
    },
    "updated": {
      "type": "object",
      "properties": {
        "dateTime": {
          "type": "string"
        },
        "timezone": {
          "type": "string"
        }
      }
    },
    "description": {
      "type": "string",
      "default" : "confirmed"
    },
    "location": {
      "type": "string",
      "default" : "confirmed"
    },
    // ----------------------------------------------- //
    "start": {
      "type": "object",
      "properties": {
        "dateTime": {
          "type": "string"
        },
        "timezone": {
          "type": "string"
        }
      }
    },
    "end": {
      "type": "object",
      "properties": {
        "dateTime": {
          "type": "string"
        },
        "timezone": {
          "type": "string"
        }
      }
    },
    "originalStartTime": {
      "type": "object",
      "properties": {
        "dateTime": {
          "type": "string",
          "final": true
        },
        "timezone": {
          "type": "string",
          "final": true
        }
      },
      "final": true
    },
    // ----------------------------------------------- //
    "recurrence" : {
      "type": "array",
      "item": {
        "type": "string"
      }
    },
    // ----------------------------------------------- //
    "iCalUID": {
      "type": "string"
    },
    "sequence": {
      "type": "number"
    },
    // ----------------------------------------------- //
    "creatorId": {
      "type": "string"
    },
    "organizer": {
      "type": "object"
    },
    "attendees": {
      "type": "object"
    },
    // ----------------------------------------------- //
    "anyoneCanAddSelf": {
      "type": "boolean"
    },
    "guestsCanInviteOthers": {
      "type": "boolean"
    },
    "guestsCanModify": {
      "type": "boolean"
    },
    "guestsCanSeeOtherGuests": {
      "type": "boolean"
    },
    "locked": {
      "type": "boolean"
    },
    "allDay": {
      "type": "boolean"
    },
    // ----------------------------------------------- //
    "calenderId": {
      "type": "number"
    },
    // ----------------------------------------------- //
  },
  "required": ["end", "start"]
}

export default eventSchema;
