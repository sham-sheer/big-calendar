export default {
  title: 'event schema',
  version: 0,
  description: 'describes a calendar event',
  type: 'object',
  properties: {
    id: {
      'type': 'string',
      'primary': true
    },
    title: {
      'type': 'string'
    },
    end: {
      'type': 'number'
    },
    start: {
      'type': 'number'
    },
    allDay: {
      'type': 'boolean'
    }
  },
  required: ['title']
}
