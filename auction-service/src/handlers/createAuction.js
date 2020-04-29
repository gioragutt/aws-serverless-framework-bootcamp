import validator from '@middy/validator';
import { v4 as uuid } from 'uuid';
import commonMiddleware from '../lib/commonMiddleware';
import { createAuction as createAuctionInDb } from '../lib/createAuction';
import { createAuctionSchema } from '../lib/schemas/createAuctionSchema';

async function createAuction(event) {
  const { title } = event.body;
  const { email } = event.requestContext.authorizer;

  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    seller: email,
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  await createAuctionInDb(auction);

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction)
  .use(validator({ inputSchema: createAuctionSchema }));
