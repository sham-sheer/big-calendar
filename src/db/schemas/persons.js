export default {
  "title": "Person schema",
  "version": 0,
  "description": "Describes a Person object",
  "type": "object",
  "properties": {
    "personId": {
      "type": "string",
      "primary": true,
    },
    "email": {
      "type": "string"
    },
    "displayName": {
      "type": "string"
    },
    "familyName": {
      "type": "string"
    }
  },
  "required": [
    "personId"
  ]
};