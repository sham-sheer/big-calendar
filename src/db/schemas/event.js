export default {
  title: 'calendar event schema',
  version: 0,
  description: 'describes a calendar event',
  type: 'object',
  properties: {
    'title': {
      'type': 'string'
    },
    'end': {
      'type': 'number'
    },
    'start': {
      'type': 'number'
    },
    'allDay': {
      'type': 'boolean'
    }
  }
}
