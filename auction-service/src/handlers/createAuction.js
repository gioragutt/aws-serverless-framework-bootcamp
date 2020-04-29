import { v4 as uuid } from 'uuid';
import commonMiddlware from '../lib/commonMiddleware';
import { createAuction as createAuctionInDb } from '../lib/db';

async function createAuction(event) {
  const { title } = event.body;

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
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

export const handler = commonMiddlware(createAuction);
