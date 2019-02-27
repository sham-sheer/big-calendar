export default {
  "title": "CalMetaData schema",
  "version": 0,
  "description": "Describes a Calendar Meta Data object",
  "type": "object",
  "properties": {
    "calMetaDataId": {
      "type": "string",
      "primary": true,
    },
    "eventId": {
      "type": "string"
    },
    "personId": {
      "type": "string"
    }
  },
  "required": [
    "eventId",
    "personId",
  ]
};