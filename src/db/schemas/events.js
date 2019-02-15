const eventSchema =  {
  "title": 'event schema',
  "version": 0,
  "description": 'describes a calendar event',
  "type": 'object',
  "properties": {
    "id": {
      'type': 'string',
      'primary': true
    },
    "summary": {
      'type': 'string',
      'default' : 'Calendar Event'
    },
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
    "allDay": {
      'type': 'boolean'
    },
    "organizer": {
      "type":"object",
      "properties": {
        "id": "string",
        "email": "string",
        "displayName": "string",
        "self": "boolean"
      }
    },
    "recurrence" : {
      "type": "array",
      "item": {
        "type": "string"
      }
    },
    "iCalUID": {
      "type": "string"
    },
    "attendees": {
      "type": "array",
      "item": {
        "type": "object",
        "properties": {
            "id": "string",
            "email": "string",
            "displayName": "string",
            "organizer": "boolean",
            "self": "boolean",
            "resource": "boolean",
            "optional": "boolean",
            "responseStatus": "string",
            "comment": "string",
            "additionalGuests": "number"
        }
      }
    }
  },
  "required": ['end', 'start']
}

export default eventSchema;
