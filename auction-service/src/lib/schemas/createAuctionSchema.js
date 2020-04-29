export const createAuctionSchema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          minLength: 1
        },
      },
      required: ['title'],
    },
  },
  required: [
    'body'
  ],
};