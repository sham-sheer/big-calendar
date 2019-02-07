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
    }
  },
  "required": ['summary', 'end', 'start']
}

export default eventSchema;
